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
};

const activePlaybacks = new Map<string, Playback>();

let lastItemAdded: any = null;

export function startPlayback(sessionId: string, data: Playback) {
  activePlaybacks.set(sessionId, data);
}

export function updatePlayback(sessionId: string, data: Partial<Playback>) {
  const existing = activePlaybacks.get(sessionId);
  if (!existing) return;

  activePlaybacks.set(sessionId, {
    ...existing,
    ...data,
  });
}

export function stopPlayback(sessionId: string) {
  activePlaybacks.delete(sessionId);
}

export function getAllPlaybacks() {
  return Array.from(activePlaybacks.values());
}

export function setLastItemAdded(item: any) {
  lastItemAdded = item; // already mapped in the webhook handler
}

export function getLastItemAdded() {
  return lastItemAdded;
}
