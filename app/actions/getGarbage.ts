import garbage from "@/public/garbage-calendar-2026.json";

export function getUpcomingGarbageEvents(limit = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return garbage.events
    .map((event) => ({
      ...event,
      labels: event.types.map(
        (type) => garbage.wasteTypes[type as keyof typeof garbage.wasteTypes],
      ),
    }))
    .filter((event) => new Date(event.date) >= today)
    .slice(0, limit);
}
