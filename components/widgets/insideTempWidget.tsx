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
  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="grid grid-cols-2 gap-3">
        {loading ? (
          <>
            <Skeleton className="h-[40px] w-[full] rounded-full" />
            <Skeleton className="h-[40px] w-[full] rounded-full" />
            <Skeleton className="h-[40px] w-[full] rounded-full" />
            <Skeleton className="h-[40px] w-[full] rounded-full" />
            <Skeleton className="h-[40px] w-[full] rounded-full" />
          </>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="flex flex-col leading-none">
              <div className="text-2xl font-bold">
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
