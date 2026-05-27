import fs from "fs";
import path from "path";
import { TokenStore } from "@/types/tokenType";

const TOKEN_URL = "https://login.tado.com/oauth2/token";
const TOKEN_FILE = path.join(process.cwd(), ".tado-token.json"); // persist here

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

  // ✅ Reuse access token if still valid
  if (tokenStore.accessToken && now < tokenStore.expiresAt) {
    return tokenStore.accessToken;
  }

  console.log("[tado] Access token expired, refreshing...");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TADO_CLIENT_ID!,
      refresh_token: tokenStore.refreshToken, // 👈 use persisted token
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`[tado] Token refresh failed: ${JSON.stringify(data)}`);
  }

  // ✅ Update in-memory store
  tokenStore = {
    refreshToken: data.refresh_token ?? tokenStore.refreshToken, // rotate if new one given
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 30_000, // 30s safety buffer
  };

  // ✅ Persist to disk
  saveTokenStore(tokenStore);

  console.log("[tado] Token refreshed and saved.");

  return tokenStore.accessToken!;
}

// ─── Fetch Wrapper ────────────────────────────────────────────────────────────

export async function tadoFetch<T = unknown>(endpoint: string): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[tado] API error on ${endpoint}: ${err}`);
  }

  return res.json() as Promise<T>;
}

// OLDER API
// https://my.tado.com/api/v2
