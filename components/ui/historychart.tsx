import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import { EnergyChartProps } from "@/types/energyTypes";

const ELEC_COLOR = "#b64afe";
const GAS_COLOR = "#ff2929cf";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "numeric",
  });
}

export function HistoryChart({ history, totalKwh, totalM3 }: EnergyChartProps) {
  const data = history.map((entry) => ({
    label: formatDate(entry.date),
    kwh: Number(entry.kwh.toFixed(3)),
    m3: Number(entry.m3.toFixed(3)),
  }));

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-row gap-6 items-baseline">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: ELEC_COLOR }}
          />
          <strong
            className="text-2xl leading-tight"
            style={{ color: ELEC_COLOR }}
          >
            {totalKwh.toFixed(2)} kWh
          </strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: GAS_COLOR }}
          />

          <strong
            className="text-2xl leading-tight"
            style={{ color: GAS_COLOR }}
          >
            {totalM3.toFixed(2)} m³
          </strong>
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: -20, bottom: -10, left: -25 }}
          barGap={2}
        >
          <CartesianGrid vertical={false} stroke="#888" strokeOpacity={0.2} />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          {/* Linker as: elektriciteit (kWh) */}
          <YAxis
            yAxisId="kwh"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9 }}
          />
          {/* Rechter as: gas (m³) */}
          <YAxis
            yAxisId="m3"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9 }}
          />
          <Bar
            yAxisId="kwh"
            dataKey="kwh"
            fill={ELEC_COLOR}
            radius={[3, 3, 0, 0]}
          />
          <Bar
            yAxisId="m3"
            dataKey="m3"
            fill={GAS_COLOR}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
