"use client";

import { Card, CardContent } from "@components/ui/card";
import { useEffect, useState } from "react";
import { glassCard } from "@/lib/constants/glassCard";
import { X } from "lucide-react";

const REFRESH_INTERVAL = 10_000;
const REFRESH_INTERVAL_FULLSCREEN = 1_000;

export function CameraWidget() {
  const [timestamp, setTimestamp] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setTimestamp(Date.now());

    update();
    const ms = fullscreen ? REFRESH_INTERVAL_FULLSCREEN : REFRESH_INTERVAL;
    const interval = setInterval(update, ms);

    return () => clearInterval(interval);
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const id = setTimeout(() => setFullscreen(false), 30_000);
    return () => clearTimeout(id);
  }, [fullscreen]);

  const baseUrl = process.env.NEXT_PUBLIC_GO2RTC_URL;
  const imgSrc = `${baseUrl}/api/frame.jpeg?src=tapo&t=${timestamp}`;

  return (
    <>
      <Card className={`h-full ${glassCard} p-0`}>
        <CardContent className="h-full flex flex-col items-center justify-center p-0">
          <button
            onClick={() => setFullscreen(true)}
            className="w-full h-full bg-muted overflow-hidden rounded-md"
            aria-label="Camera vergroten"
          >
            <img
              src={imgSrc}
              alt="Voordeur camera"
              className="h-full w-full object-cover"
            />
          </button>
        </CardContent>
      </Card>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <img
            src={imgSrc}
            alt="Voordeur camera"
            className="max-h-full max-w-full object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
            className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white"
            aria-label="Sluiten"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
