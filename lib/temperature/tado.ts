import fs from "fs";
import path from "path";
import { TokenStore } from "@/types/tokenType";

const TOKEN_URL = "https://login.tado.com/oauth2/token";
const TOKEN_FILE = path.join(process.cwd(), "data/tado-token.json"); // persist here
let refreshPromise: Promise<string> | null = null;

function loadTokenStore(): TokenStore {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const raw = fs.readFileSync(TOKEN_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[tado] Failed to load token store, using env fallback:", err);
  }

  // First run - use env variable as seed
  return {
    refreshToken: process.env.TADO_REFRESH_TOKEN!,
    accessToken: null,
    expiresAt: 0,
  };
}

function saveTokenStore(store: TokenStore): void {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[tado] Failed to save token store:", err);
  }
}

// ─── In-memory cache (avoids disk reads on every request) ─────────────────────

let tokenStore: TokenStore = loadTokenStore();

// ─── Core Logic ───────────────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // ✅ valid token
  if (tokenStore.accessToken && now < tokenStore.expiresAt) {
    return tokenStore.accessToken;
  }

  // ✅ if refresh already running, reuse it
  if (refreshPromise) {
    return refreshPromise;
  }

  console.log("[tado] Access token expired, refreshing...");

  refreshPromise = (async () => {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.TADO_CLIENT_ID!,
        refresh_token: tokenStore.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`[tado] Token refresh failed: ${JSON.stringify(data)}`);
    }

    tokenStore = {
      refreshToken: data.refresh_token ?? tokenStore.refreshToken,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000 - 30_000,
    };

    saveTokenStore(tokenStore);

    console.log("[tado] Token refreshed and saved.");

    return tokenStore.accessToken!;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// ─── Fetch Wrapper ────────────────────────────────────────────────────────────

export async function tadoFetch<T = unknown>(endpoint: string): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 👇 Retry once if 401
  if (res.status === 401) {
    tokenStore.accessToken = null; // force refresh
    tokenStore.expiresAt = 0;
    return tadoFetch<T>(endpoint);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[tado] API error on ${endpoint}: ${err}`);
  }

  return res.json() as Promise<T>;
}
