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
  const data = Array.from({ length: 24 }, (_, i) => {
    const hour = `${String(i).padStart(2, "0")}:00`;
    const match = hourlyGas.find((entry) => entry.hour === hour);
    return {
      time: hour,
      gas: match?.usage ?? 0,
    };
  });

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
          margin={{ top: 0, right: 0, bottom: -10, left: -30 }}
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
            ticks={[0.0, 0.05, 0.1, 0.15, 0.2]}
            domain={[0, 0.2]}
            tickFormatter={(value) => (value === 0 ? "0" : value.toFixed(2))}
          />
          <Area
            type="monotone"
            dataKey="gas"
            stroke="#ff2929cf"
            strokeWidth={2}
            fill="#f16363"
            fillOpacity={0.1}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
