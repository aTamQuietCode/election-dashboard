export interface RawElectionRecord {
    timestamp: string;
    party_name: string;
    cumulative_votes: number;
}

export interface ChartDataPoint {
    timestamp: Date;
    totalVotes: number;
    [partyName: string]: number | Date;
}