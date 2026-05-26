import { Card, CardContent, CardHeader } from "@components/ui/card";
import { getUpcomingGarbageEvents } from "@/lib/garbage/getGarbage";
import { formatGarbageDate } from "@/lib/garbage/formatGarbageDate";

export function GarbageWidget() {
  const garbageEvents = getUpcomingGarbageEvents();

  return (
    <Card>
      <CardHeader className="text-xl">Afvalkalender</CardHeader>
      <CardContent className="flex flex-col gap-3">
        {garbageEvents.length === 0 ? (
          <p className="text-sm font-normal text-muted-foreground">
            Geen afval deze periode
          </p>
        ) : (
          garbageEvents.map((event) => (
            <div
              key={event.date}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-col">
                <span className="font-bold">
                  {formatGarbageDate(event.date)}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {event.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
