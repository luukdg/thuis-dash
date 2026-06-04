import { Card, CardContent } from "@components/ui/card";
import { getUpcomingGarbageEvents } from "@/lib/garbage/getGarbage";
import { formatGarbageDate } from "@/lib/garbage/formatGarbageDate";
import { Badge } from "@components/ui/badge";
import { glassCard } from "@/lib/constants/glassCard";
import { wasteColors } from "@/lib/constants/wasteColors";

export function GarbageWidget() {
  const garbageEvents = getUpcomingGarbageEvents();

  return (
    <Card className={`h-full ${glassCard} p-0`}>
      <CardContent className="flex flex-col gap-1 p-1">
        {garbageEvents.length === 0 ? (
          <p className="text-sm font-normal text-muted-foreground">
            Geen afval deze periode
          </p>
        ) : (
          garbageEvents.map((event) => (
            <div
              key={event.date}
              className="flex flex-col gap-1 rounded-xl border p-3"
            >
              <div className="flex flex-col">
                <span className="font-bold text-xl">
                  {formatGarbageDate(event.date)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.types.map((type) => (
                  <Badge
                    key={type}
                    className={wasteColors[type] ?? "bg-gray-400 text-white"}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
