"use client";

import { Card, CardContent } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";
import { useState, useEffect } from "react";
import { Radial } from "@components/ui/radial";
import { GasChart } from "@components/ui/gaschart";

export function EnergyWidget() {
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [hourlyData, setHourlyData] = useState<{
    charts: {
      hourlyGas: any[];
      hourlyKwh: any[];
    };
    today: { kwh: number; m3: number };
  } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("api/homewizard/current/");
      const data = await res.json();
      setCurrentEnergy(data.currentElectriciy);
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadHourlyData() {
      const res = await fetch("api/homewizard/history/");
      const data = await res.json();

      setHourlyData(data);
    }

    loadHourlyData();
    const interval = setInterval(loadHourlyData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`h-full ${glassCard} py-2`}>
      <CardContent className="grid grid-cols-3 items-center justify-center h-full">
        {/* Electricity */}

        <div className="flex flex-col items-center justify-center w-full h-full pr-3">
          <Radial
            type="electricity"
            value={currentEnergy}
            totalKwh={hourlyData?.today.kwh ?? 0}
            fill="#b64afe"
          />
        </div>

        {/* Gas */}
        <div className="flex flex-col items-center justify-center col-span-2 w-full h-full">
          <GasChart
            hourlyGas={hourlyData?.charts.hourlyGas ?? []}
            totalM3={hourlyData?.today.m3 ?? 0}
          />
        </div>
      </CardContent>
    </Card>
  );
}
