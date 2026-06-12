"use client";

import { Card, CardContent } from "@components/ui/card";
import Image from "next/image";
import { glassCard } from "@/lib/constants/glassCard";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  description: string;
  iconUrl: string;
};

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Weather fetch faalde:", error);
      }
    }

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const temp = weatherData?.temp;
  let backgroundClass = "bg-gradient-to-br from-sky-300 via-sky-400 to-sky-500";
  if (typeof temp === "number" && temp > 25) {
    backgroundClass =
      "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500";
  } else if (typeof temp === "number" && temp < 10) {
    backgroundClass =
      "bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500";
  }

  return (
    <Card className={`h-full ${glassCard} ${backgroundClass}`}>
      <CardContent className="h-full">
        <div className="flex h-full w-full flex-col justify-center items-center gap-2 text-black">
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold">Veldhoven</p>
            {weatherData?.description}
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="text-7xl font-semibold flex flex-row">
              {weatherData?.temp}°{" "}
            </div>
            {weatherData?.iconUrl && (
              <Image
                src={weatherData.iconUrl}
                alt={weatherData.description ?? "Weather icon"}
                width={25}
                height={25}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
