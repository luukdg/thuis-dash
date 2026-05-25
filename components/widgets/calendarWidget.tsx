"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { getCalendarEvents } from "@/app/actions/getCalendar";
import { useState } from "react";
import type { calendar_v3 } from "googleapis";

export function CalendarWidget() {
  const [events, setEvents] = useState<calendar_v3.Schema$Event[] | undefined>(
    [],
  );

  const fetchCalendar = async () => {
    try {
      const result = await getCalendarEvents();
      setEvents(result);

      console.log(result);
    } catch (error) {
      console.error("Failed to fetch commute time:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="text-xl">Afspraken</CardHeader>
      <CardContent className="space-y-3">
        {events?.map((event) => {
          const isAllDay = !!event.start?.date;

          const time = isAllDay
            ? "All day"
            : event.start?.dateTime
              ? new Date(event.start.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

          return (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-md border p-3"
            >
              <div className="w-16 text-sm text-muted-foreground">{time}</div>

              <div className="flex-1">
                <p className="font-medium leading-tight">
                  {event.summary || "Untitled event"}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchCalendar}>Fetch data</Button>
      </CardFooter>
    </Card>
  );
}
