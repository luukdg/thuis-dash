import garbage from "@/public/garbage-calendar-2026.json";

export function getUpcomingGarbageEvents(limit = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  const daysUntilSunday = (7 - today.getDay()) % 7;

  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  return garbage.events
    .map((event) => ({
      ...event,
      labels: event.types.map(
        (type) => garbage.wasteTypes[type as keyof typeof garbage.wasteTypes],
      ),
    }))
    .filter((event) => {
      const eventDate = new Date(event.date);

      return eventDate >= today && eventDate < endOfWeek;
    })
    .slice(0, limit);
}
