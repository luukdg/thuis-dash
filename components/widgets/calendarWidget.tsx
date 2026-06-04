import { Card, CardContent, CardHeader } from "@components/ui/card";
import { calendar } from "@/lib/calendar/google";
import { unstable_cache } from "next/cache";
import { CalendarEvent } from "@/types/calendarType";
import { glassCard } from "@/lib/constants/glassCard";

const getCalendarEvents = unstable_cache(
  async (dateKey: string): Promise<CalendarEvent[]> => {
    const startOfToday = new Date(dateKey);
    startOfToday.setHours(0, 0, 0, 0);

    const endDate = new Date(dateKey);
    endDate.setDate(endDate.getDate() + 60);
    endDate.setHours(23, 59, 59, 999);

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: startOfToday.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = res.data.items ?? [];

    return items.map((event) => ({
      id: event.id ?? crypto.randomUUID(),
      summary: event.summary ?? "Untitled event",
      start: event.start?.dateTime ?? event.start?.date ?? "",
      end: event.end?.dateTime ?? event.end?.date ?? "",
      allDay: !event.start?.dateTime,
    }));
  },
  ["calendar-events"],
  {
    revalidate: 300,
    tags: ["calendar-events"],
  },
);

function groupEventsByDate(
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

function formatDateHeader(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00");
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}

export async function CalendarWidget() {
  const today = new Date().toISOString().split("T")[0];
  const events = await getCalendarEvents(today);
  const groupedEvents = groupEventsByDate(events);

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardHeader className="text-xl">Afspraken</CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Geen aankomende afspraken
          </p>
        ) : (
          Array.from(groupedEvents.entries()).map(([dateKey, dayEvents]) => (
            <div key={dateKey} className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {formatDateHeader(dateKey)}
              </p>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-2xl p-3 border-1 bg-muted"
                >
                  <span className="w-16 shrink-0 text-sm">
                    {event.allDay
                      ? "Hele dag"
                      : new Date(event.start).toLocaleTimeString("nl-NL", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                  </span>
                  <p className="flex-1 font-semibold leading-tight">
                    {event.summary}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
