export interface RawElectionRecord {
  timestamp: string;
  party_name: string;
  cumulative_votes: number | string;
  [key: string]: any;
}

export interface ChartDataPoint {
  timestamp: string;
  minutes: number;
  totalVotes: number;
  baseTimestamp: string;
  [key: string]: any; // 動的な政党名、_share, _delta を受け入れる
}