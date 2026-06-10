"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { CalendarEvent } from "@/types/calendarType";
import { glassCard } from "@/lib/constants/glassCard";
import { useEffect, useMemo, useState } from "react";
import {
  groupEventsByDate,
  formatDateHeader,
} from "@/lib/calendar/helperFunctions";
import { Skeleton } from "@components/ui/skeleton";

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/calendar");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardHeader className="text-xl">Afspraken</CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {loading ? (
          <>
            {[1, 2, 3].map((day) => (
              <div key={day} className="space-y-3">
                {/* Datum */}
                <Skeleton className="h-4 w-16" />

                {/* Event(s) */}
                <div className="space-y-2">
                  <Skeleton className="h-[46px] w-full rounded-2xl" />
                  {day === 2 && (
                    <Skeleton className="h-[46px] w-full rounded-2xl" />
                  )}
                </div>
              </div>
            ))}
          </>
        ) : events.length === 0 ? (
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
                  <p className="flex-1 text-lg font-semibold leading-tight">
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
