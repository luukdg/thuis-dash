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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setRooms(data);
      setLoading(false);
    }

    load();

    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
        ) : rooms.length === 0 ? (
          <div className="col-span-full text-center text-red-500">
            Netwerkfout
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col bg-muted rounded-xl px-3 justify-center "
            >
              <div
                className={`text-3xl font-bold ${room.isHeating ? "text-yellow-500" : "text-green-500"}`}
              >
                {room.temperature.toFixed(1)}°
              </div>

              <div className="text-xs  truncate leading-none">{room.name}</div>
              <div className="text-xs text-muted-foreground">
                Ingesteld op{" "}
                <strong className="text-foreground">
                  {room.setting?.toFixed(1)}°
                </strong>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
