"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { useEffect, useState } from "react";
import { glassCard } from "@/lib/constants/glassCard";

const REFRESH_INTERVAL = 10_000;

export function CameraWidget() {
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    const update = () => setTimestamp(Date.now());

    update();
    const interval = setInterval(update, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_GO2RTC_URL;

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardHeader className="text-xl">Camera</CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
          <img
            src={`${baseUrl}/api/frame.jpeg?src=tapo&t=${timestamp}`}
            alt="Voordeur camera"
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
