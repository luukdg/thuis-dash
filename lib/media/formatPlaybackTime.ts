export function formatPlayBackTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function getProgressPercent(currentTime?: number, duration?: number) {
  if (!currentTime || !duration || duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
}
