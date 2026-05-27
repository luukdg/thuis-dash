"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Label,
} from "recharts";

const electricityData = [
  {
    name: "Stroom",
    value: 90, // percentage of dagverbruik
    fill: "#9b60fa",
  },
];

const gasData = [
  {
    name: "Gas",
    value: 42,
    fill: "#e314a9",
  },
];

function Radial({ data, type }: { data: any[]; type: "electricity" | "gas" }) {
  const isElectricity = type === "electricity";

  const unit = isElectricity ? "W" : "m³";
  const color = isElectricity ? "#9b60fa2a" : "#e314a82d";

  return (
    <ResponsiveContainer width="100%" height={140}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="90%"
        outerRadius="110%"
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

        <RadialBar background={{ fill: color }} dataKey="value" />

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
                  {data[0].value}
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
  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="grid grid-cols-2 items-center justify-center h-full">
        {/* Electricity */}
        <div className="flex flex-col items-center">
          <Radial data={electricityData} type="electricity" />
        </div>

        {/* Gas */}
        <div className="flex flex-col items-center">
          <Radial data={gasData} type="gas" />
        </div>
      </CardContent>
    </Card>
  );
}
