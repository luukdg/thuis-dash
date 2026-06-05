import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface HourlyGas {
  hour: string;
  usage: number;
}

interface GasChartProps {
  hourlyGas: HourlyGas[];
  totalM3: number;
}

export function GasChart({ hourlyGas, totalM3 }: GasChartProps) {
  const currentHour = new Date().getHours();

  const data = Array.from({ length: 24 }, (_, i) => {
    const hour = `${String(i).padStart(2, "0")}:00`;
    const match = hourlyGas.find((entry) => entry.hour === hour);
    return {
      time: hour,
      // null for future hours — Recharts won't draw the line there
      gas: i <= currentHour ? (match?.usage ?? 0) : null,
    };
  });

  const maxGas = Math.max(...data.map((d) => d.gas ?? 0), 0.01);
  const yMax = parseFloat((maxGas * 1.2).toFixed(3));

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="w-full flex flex-row gap-2">
        <strong
          className="text-2xl leading-tight"
          style={{ color: "#ff2929cf" }}
        >
          {totalM3.toFixed(2)} m³
        </strong>
      </div>

      <ResponsiveContainer className="p-0" width="100%" height="100%">
        <AreaChart
          margin={{ top: 0, right: 0, bottom: -10, left: -25 }}
          data={data}
        >
          <CartesianGrid vertical={false} stroke="#888" strokeOpacity={0.2} />
          <XAxis
            axisLine={false}
            tickLine={false}
            dataKey="time"
            tick={{ fontSize: 10 }}
            ticks={["00:00", "06:00", "12:00", "18:00", "23:00"]}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9 }}
            domain={[0, yMax]}
            tickFormatter={(value) => (value === 0 ? "0" : value.toFixed(3))}
          />
          <Area
            type="monotone"
            dataKey="gas"
            stroke="#ff2929cf"
            strokeWidth={2}
            fill="#f16363"
            fillOpacity={0.1}
            dot={false}
            connectNulls={false} // ensures line stops at null
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
