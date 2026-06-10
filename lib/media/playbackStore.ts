type Playback = {
  sessionId: string;
  title: string;
  series?: string;
  season?: string;
  episode?: number;
  user: string;
  device: string;
  startedAt: string;
  currentTime?: number;
  duration?: number;
  lastSeen: number;
};

const activePlaybacks = new Map<string, Playback>();
const STALE_THRESHOLD_MS = 90_000; // 90s zonder progress = dode sessie

let lastItemAdded: any = null;

export function startPlayback(
  sessionId: string,
  data: Omit<Playback, "lastSeen">, // ← caller hoeft het niet te geven
) {
  activePlaybacks.set(sessionId, { ...data, lastSeen: Date.now() });
}

export function updatePlayback(sessionId: string, data: Partial<Playback>) {
  const existing = activePlaybacks.get(sessionId);
  if (!existing) return;

  activePlaybacks.set(sessionId, {
    ...existing,
    ...data,
    lastSeen: Date.now(), // elke PlaybackProgress ververst de levensduur
  });
}

export function stopPlayback(sessionId: string) {
  activePlaybacks.delete(sessionId);
}

export function getAllPlaybacks() {
  const now = Date.now();

  // ruim ghost sessions op die geen progress meer sturen
  for (const [id, p] of activePlaybacks) {
    if (now - p.lastSeen > STALE_THRESHOLD_MS) {
      activePlaybacks.delete(id);
    }
  }

  return Array.from(activePlaybacks.values());
}

export function setLastItemAdded(item: any) {
  lastItemAdded = item;
}

export function getLastItemAdded() {
  return lastItemAdded;
}
