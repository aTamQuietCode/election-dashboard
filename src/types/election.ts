export interface RawElectionRecord {
  timestamp: string;
  party_name: string;
  cumulative_votes: number | string;
  [key: string]: unknown;
}

export interface ChartDataPoint {
  timestamp: string;
  minutes: number;
  totalVotes: number;
  baseTimestamp: string;
  [key: string]: string | number; // 動的な政党名、_share, _delta を受け入れる
}

export interface TripleElectionChartData {
  election2021: ChartDataPoint[];
  election2024: ChartDataPoint[];
  election2026: ChartDataPoint[];
}

export const PARTY_COLORS: Record<string, string> = {
    "れいわ新選組": "#f63bc1",
    "中道改革連合": "#000dff",
    "日本維新の会": "#0b9a10",
    "参政党": "#ff9335",
    "国民民主党": "#d4cd00",
    "日本保守党": "#6c93ff",
    "チームみらい": "#5aeeff",
    "社会民主党": "#3045ff",
    "自由民主党": "#a10808",
    "日本共産党": "#ed0000",
    "ゆうこく連合": "#0010a3",
    "立憲民主党": "#000dff",
    "公明党": "#3d64ab",
    "N党": "#f4cf14"
};