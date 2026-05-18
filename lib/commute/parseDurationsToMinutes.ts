export function parseDurationToMinutes(duration: string) {
  const seconds = parseInt(duration.replace("s", ""));
  return Math.trunc(seconds / 60);
}
