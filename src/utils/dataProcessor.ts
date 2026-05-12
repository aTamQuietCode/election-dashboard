import type { ChartDataPoint, RawElectionRecord } from "../types/election";

export const processElectionCSV = (data: RawElectionRecord[]): ChartDataPoint[] => {
    const timeMap = new Map<string, ChartDataPoint>();

    data.forEach(record => {
        if (!record.timestamp || !record.party_name) return;

        if (!timeMap.has(record.timestamp)) {
            timeMap.set(record.timestamp, {
                timestamp: record.timestamp as unknown as Date, // Will be converted to Date later
                totalVotes: 0,
            });
        }

        const votesRaw = record.cumulative_votes;
        const votes = typeof votesRaw === 'string' ? parseInt(String(votesRaw).replace(/,/g, ''), 10) : votesRaw;

        const point = timeMap.get(record.timestamp)!;
        console.log("Party Name:", record.party_name, "Cumulative Votes:", record.cumulative_votes); // ← これで党名と得票数を確認
        point[record.party_name] = votes;
        point.totalVotes += votes;
    });

    // Additional calculation of vote percentage for each time point
    return Array.from(timeMap.values()).map(point => {
        const updatePoint = { ...point };
        Object.keys(point).forEach(key => {
            if (key !== 'timestamp' && key !== 'totalVotes') {
                const votes = point[key] as number;
                updatePoint[`${key}_share`] = point.totalVotes > 0 ? parseFloat(((votes / point.totalVotes) * 100).toFixed(2)) : 0;
            }
        });
        return updatePoint;
    });
};