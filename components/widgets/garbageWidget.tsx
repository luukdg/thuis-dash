import { Card, CardContent, CardHeader } from "@components/ui/card";
import { getUpcomingGarbageEvents } from "@/lib/garbage/getGarbage";
import { formatGarbageDate } from "@/lib/garbage/formatGarbageDate";
import { Badge } from "@components/ui/badge";

export function GarbageWidget() {
  const garbageEvents = getUpcomingGarbageEvents();

  return (
    <Card className="h-full">
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
                <span className="font-bold text-xs">
                  {formatGarbageDate(event.date)}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {event.labels.map((label) => (
                  <Badge key={label}>{label}</Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
