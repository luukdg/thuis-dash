"use client";

import { Card, CardContent } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";
import { useState, useEffect } from "react";
import { Radial } from "@components/ui/radial";
import { HistoryChart } from "@components/ui/historychart";
import { EnergyData } from "@/types/energyTypes";

export function EnergyWidget() {
  const [currentEnergy, setCurrentEnergy] = useState<number>(0);
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("api/homewizard/current/");
      const data = await res.json();
      setCurrentEnergy(data.currentElectriciy);
    }

    load();
    const interval = setInterval(load, 5000); // 5 seconden
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadEnergyData() {
      const res = await fetch("/api/homewizard/history/");
      const data = await res.json();
      setEnergyData(data);
    }

    loadEnergyData();
    const interval = setInterval(loadEnergyData, 15 * 60 * 1000); // 15 minuten
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
            totalKwh={energyData?.today.kwh ?? 0}
            fill="#b64afe"
          />
        </div>

        {/* Gas */}
        <div className="flex flex-col items-center justify-center col-span-2 w-full h-full">
          <HistoryChart
            history={energyData?.history ?? []}
            totalKwh={energyData?.today.kwh ?? 0}
            totalM3={energyData?.today.m3 ?? 0}
          />
        </div>
      </CardContent>
    </Card>
  );
}
