"use client";

import { Card, CardContent } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";
import { useEffect, useState } from "react";

type CommuteData = {
  minutes: number;
  distanceKm: string;
};

export function CommuteWidget() {
  const [now, setNow] = useState<Date | null>(null);
  const [commuteTime, setCommuteTime] = useState<CommuteData | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Data: poll elke 15 min, alleen tussen 7-9
  useEffect(() => {
    async function load() {
      try {
        const hour = new Date().getHours();
        if (hour < 7 || hour >= 9) return;

        const res = await fetch("/api/commute");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setCommuteTime(data);
      } catch (error) {
        console.error("Commute fetch faalde:", error);
      }
    }

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = now?.getHours();
  const inCommuteWindow = hour !== undefined && hour >= 7 && hour < 9;

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="flex items-center justify-center h-full">
        {inCommuteWindow ? (
          <div className="flex flex-col font-bold text-5xl items-center">
            <p
              className={
                commuteTime?.minutes === undefined
                  ? "text-muted-foreground"
                  : commuteTime.minutes < 30
                    ? "text-green-500"
                    : commuteTime.minutes < 60
                      ? "text-yellow-500"
                      : "text-red-500"
              }
            >
              {commuteTime?.minutes ?? "--"} min
            </p>
            <p className="text-xl">({commuteTime?.distanceKm ?? "--"} km)</p>
            <p className="text-sm text-muted-foreground">Veldhoven → Veghel</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="font-bold text-7xl tabular-nums">
              {now?.toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
              }) ?? "--:--"}
            </p>
            <p className="text-xl text-muted-foreground capitalize">
              {now?.toLocaleDateString("nl-NL", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
