export function formatGarbageDate(dateString: string) {
  const formatter = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter
    .formatToParts(new Date(dateString))
    .map((part) => (part.type === "weekday" ? part.value : part.value))
    .join("");
}
