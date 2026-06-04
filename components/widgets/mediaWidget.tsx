"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { useState, useEffect } from "react";
import { glassCard } from "@/lib/constants/glassCard";
import { Badge } from "@components/ui/badge";
import {
  formatPlayBackTime,
  getProgressPercent,
} from "@/lib/media/formatPlaybackTime";

export function MediaWidget() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/jellyfin/playback");
      const json = await res.json();
      setItems(json);
    };

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`h-full ${glassCard} p-0 overflow-y-auto`}>
      <CardContent className="flex flex-col gap-3 p-1 h-full">
        {items.length > 0 ? (
          items.map((item) => {
            return (
              <div
                key={item.sessionId}
                className="flex flex-col gap-1 rounded-xl border p-3"
              >
                <p className="font-bold">{item.series}</p>
                <p className="text-sm opacity-80">
                  Seizoen {item.season} • Aflevering {item.episode}
                </p>
                <Badge>
                  {item.user} • {item.device}
                </Badge>
                <div className="h-1 w-full bg-white/10 rounded overflow-hidden mt-3">
                  <div
                    className="h-full bg-white/60 transition-all duration-300"
                    style={{
                      width: `${getProgressPercent(item.currentTime, item.duration)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center">
            Nothing playing right now
          </div>
        )}
      </CardContent>
    </Card>
  );
}
