"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { useState, useEffect } from "react";
import { DeviceType } from "@/types/tadoTypes";

export function AtHomeWidget() {
  const [devices, setDevices] = useState<DeviceType[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tado/devices");
      const data = await res.json();

      setDevices(data);
    }

    load();

    const interval = setInterval(load, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="text-xl">Thuis</CardHeader>
      <CardContent className="flex flex-col gap-3">
        {devices.map((device) => (
          <div key={device.id} className="flex justify-between">
            <span>{device.name}</span>
            <span>{device.atHome ? "🏠" : "🚶"}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
