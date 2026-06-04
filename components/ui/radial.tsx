import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Label,
} from "recharts";

export function Radial({
  value,
  type,
  fill,
  totalKwh,
}: {
  value: number;
  type: "electricity" | "gas";
  fill: string;
  totalKwh: number;
}) {
  const isElectricity = type === "electricity";
  const unit = isElectricity ? "W" : "m³";
  const color = isElectricity ? "#9b60fa2a" : "#e314a82d";

  const MAX_WATTS = 3000;
  const percentage = Math.min(100, Math.round((value / MAX_WATTS) * 100));

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="w-full flex flex-col">
        <strong className="text-2xl leading-tight" style={{ color: fill }}>
          {(totalKwh ?? 0).toFixed(2)} kWh
        </strong>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="80%"
          outerRadius="100%"
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
                    fontSize={30}
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
    </div>
  );
}
