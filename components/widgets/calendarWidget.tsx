import { Card, CardContent, CardHeader } from "@components/ui/card";
import { calendar } from "@/lib/calendar/google";
import { unstable_cache } from "next/cache";

const getCalendarEvents = unstable_cache(
  async () => {
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

    return res.data.items ?? [];
  },
  ["calendar-events"], // cache key
  { revalidate: 1800 }, // 30 minutes
);

export async function CalendarWidget() {
  const events = await getCalendarEvents();

  return (
    <Card className="h-full">
      <CardHeader className="text-xl">Afspraken</CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Geen afspraken vandaag
          </p>
        )}
        {events.map((event) => {
          const isAllDay = !!event.start?.date;
          const time = isAllDay
            ? "Hele dag"
            : event.start?.dateTime
              ? new Date(event.start.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "";

          return (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="w-16 text-sm text-muted-foreground">{time}</div>
              <div className="flex-1">
                <p className="font-medium leading-tight">
                  {event.summary ?? "Untitled event"}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
