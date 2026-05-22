"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { getCalendar } from "@/app/actions/getCalendar";

export function CalendarWidget() {
  const fetchCalendar = async () => {
    try {
      const result = await getCalendar();

      console.log(result);
    } catch (error) {
      console.error("Failed to fetch commute time:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="text-xl">Calendar</CardHeader>
      <CardContent className="font-bold">No events scheduled</CardContent>
      <CardFooter>
        <Button onClick={fetchCalendar}>Fetch data</Button>
      </CardFooter>
    </Card>
  );
}
