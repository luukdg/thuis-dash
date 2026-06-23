"use client";

import { Card, CardContent, CardFooter } from "@components/ui/card";
import { useState, useEffect } from "react";
import { glassCard } from "@/lib/constants/glassCard";
import { Badge } from "@components/ui/badge";
import { getProgressPercent } from "@/lib/media/formatPlaybackTime";
import { JellyfinLogo } from "@components/ui/jellyfin";

export function MediaWidget() {
  const [items, setItems] = useState<any[]>([]);
  const [lastAdded, setLastAdded] = useState<any>(null);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = async () => {
      try {
        const [playbackRes, addedRes] = await Promise.all([
          fetch("/api/jellyfin/playback"),
          fetch("/api/jellyfin/last-added"),
        ]);

        if (active && playbackRes.ok) {
          const json = await playbackRes.json();
          setItems(Array.isArray(json) ? json : []); // guard against non-array
        }

        if (active && addedRes.ok) {
          setLastAdded(await addedRes.json());
        }
      } catch (err) {
        console.error("Failed loading media", err);
      } finally {
        if (active) {
          timeoutId = setTimeout(tick, 5000); // schedule next only after this finishes
        }
      }
    };

    tick();

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Card className={`h-full ${glassCard} p-0 gap-0`}>
      <CardContent className="flex flex-col gap-3 p-1 h-full overflow-y-auto pb-0">
        {items.length > 0 ? (
          items.map((item) => {
            const key =
              item.sessionId ??
              (item.type === "series"
                ? `${item.user}-${item.series}-${item.episode}`
                : `${item.user}-${item.title}`);

            return (
              <div
                key={key}
                className="flex flex-col gap-1 rounded-xl border p-3"
              >
                {item.type === "series" ? (
                  <>
                    <p className="font-bold">{item.series}</p>
                    <p className="text-xs opacity-80">
                      Seizoen {item.season} • Aflevering {item.episode}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs opacity-80">Film</p>
                  </>
                )}
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
        <JellyfinLogo className="w-4 h-4" />
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
