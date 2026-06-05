import { CalendarEvent } from "@/types/calendarType";

export function groupEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const dateKey = event.start.split("T")[0];
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  }

  return grouped;
}

export function formatDateHeader(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00");
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}
