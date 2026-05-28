"use client";

import { Card, CardContent } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";
import { useState, useEffect } from "react";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Label,
} from "recharts";

function Radial({
  value,
  type,
  fill,
}: {
  value: number;
  type: "electricity" | "gas";
  fill: string;
}) {
  const isElectricity = type === "electricity";
  const unit = isElectricity ? "W" : "m³";
  const color = isElectricity ? "#9b60fa2a" : "#e314a82d";
  const MAX_WATTS = 3000;
  const percentage = Math.min(100, Math.round((value / MAX_WATTS) * 100));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="90%"
        outerRadius="110%"
        barSize={12}
        data={[{ value: percentage }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

        <RadialBar background={{ fill: color }} dataKey="value" fill={fill} />

        <Label
          content={({ viewBox }) => {
            const { cx, cy } = viewBox as any;

            return (
              <g>
                <text
                  x={cx}
                  y={cy + 2}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={40}
                  fontWeight={700}
                >
                  {value}
                </text>

                <text
                  x={cx}
                  y={cy + 24}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize={14}
                >
                  {unit}
                </text>
              </g>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function EnergyWidget() {
  const [energy, setEnergy] = useState(0);
  const [gas, setGas] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await fetch("api/homewizard");
      const data = await res.json();

      setEnergy(data.power_w);
      setGas(data.external?.[0]?.value ?? 0);
      console.log(data.power_w);
      console.log(data.external?.[0]?.value);
    }

    load();

    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="grid grid-cols-2 items-center justify-center h-full">
        {/* Electricity */}
        <div className="flex flex-col items-center">
          <Radial type="electricity" value={energy} fill="#9b60fa" />
        </div>

        {/* Gas */}
        <div className="flex flex-col items-center">
          <Radial type="gas" value={gas} fill="#e314a9" />
        </div>
      </CardContent>
    </Card>
  );
}
