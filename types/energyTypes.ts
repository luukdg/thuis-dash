export type EnergyData = {
  today: { kwh: number; m3: number };
  history: { date: string; kwh: number; m3: number }[];
};

interface HistoryEntry {
  date: string; // 'YYYY-MM-DD'
  kwh: number;
  m3: number;
}

export interface EnergyChartProps {
  history: HistoryEntry[];
  totalKwh: number;
  totalM3: number;
}
