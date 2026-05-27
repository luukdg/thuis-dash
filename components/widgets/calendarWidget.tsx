import { Card, CardContent, CardHeader } from "@components/ui/card";
import { calendar } from "@/lib/calendar/google";
import { unstable_cache } from "next/cache";
import { CalendarEvent } from "@/types/calendarType";
import { glassCard } from "@/lib/constants/glassCard";

const getCalendarEvents = unstable_cache(
  async (): Promise<CalendarEvent[]> => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: startOfToday.toISOString(),
      timeMax: endOfToday.toISOString(),
      maxResults: 20,
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
  { revalidate: 1800 },
);

export async function CalendarWidget() {
  const events = await getCalendarEvents();

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardHeader className="text-xl">Afspraken</CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Geen afspraken vandaag
          </p>
        ) : (
          events.map((event) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
}
