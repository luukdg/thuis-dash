"use client";

import { Card, CardContent, CardFooter } from "@components/ui/card";
import { useState, useEffect } from "react";
import { glassCard } from "@/lib/constants/glassCard";
import { Badge } from "@components/ui/badge";
import {
  formatPlayBackTime,
  getProgressPercent,
} from "@/lib/media/formatPlaybackTime";

export function MediaWidget() {
  const [items, setItems] = useState<any[]>([]);
  const [lastAdded, setLastAdded] = useState<any>(null);

  useEffect(() => {
    const loadPlayback = async () => {
      const res = await fetch("/api/jellyfin/playback");
      if (!res.ok) {
        console.error("Failed loading playback");
        return;
      }
      const json = await res.json();
      setItems(json);
    };

    const loadAdded = async () => {
      const res = await fetch("/api/jellyfin/last-added");
      if (!res.ok) {
        console.error("Failed loading last-added");
        return;
      }
      const json = await res.json();
      setLastAdded(json);
    };

    loadPlayback();
    loadAdded();

    const interval = setInterval(() => {
      loadPlayback();
      loadAdded();
    }, 5000);

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
            Niks aan het afspelen
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground gap-2">
        <span>🆕</span>
        {lastAdded ? (
          lastAdded.type === "Episode" ? (
            <span>
              {lastAdded.series}{" "}
              <span className="font-medium text-foreground">
                S{String(lastAdded.season).padStart(2, "0")}E
                {String(lastAdded.episode).padStart(2, "0")}
              </span>
              {" — "}
              {lastAdded.title}
            </span>
          ) : (
            <span>{lastAdded.title}</span>
          )
        ) : (
          <span>Geen nieuwe items</span>
        )}
      </CardFooter>
    </Card>
  );
}
