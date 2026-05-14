export interface RawElectionRecord {
    timestamp: string;
    party_name: string;
    cumulative_votes: number;
}

export interface ChartDataPoint {
    timestamp: string;
    minutes: number;
    totalVotes: number;
    baseTimestamp?: string;
    [partyName: string]: any;
}