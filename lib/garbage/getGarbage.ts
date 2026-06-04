import garbage from "@/public/garbage-calendar-2026.json";

export function getUpcomingGarbageEvents(limit = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return garbage.events
    .map((event) => ({
      ...event,
      labels: event.types.map(
        (type) => garbage.wasteTypes[type as keyof typeof garbage.wasteTypes],
      ),
    }))
    .filter((event) => {
      const eventDate = new Date(event.date);

      return eventDate >= today;
    })
    .slice(0, limit);
}
