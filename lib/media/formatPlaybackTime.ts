export function getProgressPercent(currentTime?: number, duration?: number) {
  if (!currentTime || !duration || duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
}
