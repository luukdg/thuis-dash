"use client";

import { Card, CardContent } from "@components/ui/card";
import { useState, useEffect } from "react";
import { RoomTemp } from "@/types/tadoTypes";
import { Skeleton } from "@components/ui/skeleton";
import { glassCard } from "@/lib/constants/glassCard";

export function InsideTempWidget() {
  const [rooms, setRooms] = useState<RoomTemp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tado/temp");
      const data = await res.json();

      setRooms(data);
      setLoading(false);
    }

    load();

    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (temp: number) => {
    if (temp > 26) return "text-orange-500";
    if (temp > 20) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className={`h-full w-full ${glassCard} p-0`}>
      <CardContent className="grid h-full w-full grid-cols-2 p-1 gap-1">
        {loading ? (
          <>
            <Skeleton className="h-full w-full rounded-full" />
            <Skeleton className="h-full w-[full] rounded-full" />
            <Skeleton className="h-full w-[full] rounded-full" />
            <Skeleton className="h-full w-[full] rounded-full" />
            <Skeleton className="h-full w-[full] rounded-full" />
          </>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col leading-none bg-muted rounded-xl px-3 justify-center"
            >
              <div
                className={`text-2xl font-bold ${getHeatColor(room.temperature)}`}
              >
                {room.temperature.toFixed(1)}°
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {room.name}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
