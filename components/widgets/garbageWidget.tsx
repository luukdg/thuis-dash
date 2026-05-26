"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { getUpcomingGarbageEvents } from "@/app/actions/getGarbage";

export function GarbageWidget() {
  const [garbageEvents, setGarbageEvents] = useState<any[]>([]);

  function fetchGarbage() {
    const result = getUpcomingGarbageEvents();

    console.log(result);
  }

  return (
    <Card>
      <CardHeader className="text-xl">Afvalkalender</CardHeader>
      <CardContent className="font-bold flex flex-row gap-3"></CardContent>
      <CardFooter>
        <Button onClick={fetchGarbage}>Fetch data</Button>
      </CardFooter>
    </Card>
  );
}
