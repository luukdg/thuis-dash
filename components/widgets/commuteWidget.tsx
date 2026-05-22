"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { getCommuteTime } from "@/app/actions/getCommuteTime";
import { parseDurationToMinutes } from "@/lib/commute/parseDurationsToMinutes";
import { useState, useEffect } from "react";

export function CommuteWidget() {
  const [commuteTime, setCommuteTime] = useState(0);

  const fetchCommuteTime = async () => {
    try {
      const result = await getCommuteTime();

      const durationInSeconds = result?.routes[0]?.duration;
      if (!durationInSeconds) throw new Error("Invalid route data");

      const minutes = parseDurationToMinutes(durationInSeconds);

      setCommuteTime(minutes);
      localStorage.setItem("commuteTime", String(minutes));

      console.log("Commute time to work:", minutes, "minutes");
    } catch (error) {
      console.error("Failed to fetch commute time:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("commuteTime");

    setCommuteTime(Number(saved));
  }, []);

  return (
    <Card>
      <CardHeader className="text-xl">Reistijd Evie</CardHeader>
      <CardContent className="font-bold">{commuteTime} Minutes</CardContent>
      <CardFooter>
        <Button onClick={fetchCommuteTime}>Fetch data</Button>
      </CardFooter>
    </Card>
  );
}
