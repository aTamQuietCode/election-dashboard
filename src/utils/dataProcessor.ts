import type { ChartDataPoint, RawElectionRecord } from "../types/election";

export const processElectionCSV = (data: RawElectionRecord[]): ChartDataPoint[] => {
    const timeMap = new Map<string, ChartDataPoint>();

    const validData = data.filter(d => !isNaN(new Date(d.timestamp).getTime()));
    if (validData.length === 0) return [];

    const sortedByTime = [...validData].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const baseDate = new Date(sortedByTime[0].timestamp);
    const baseTimeMs = baseDate.getTime();
    const baseTimestampStr = sortedByTime[0].timestamp;

    data.forEach((record) => {
        const timestamp = String(record["timestamp"] || "").trim();
        if (!timestamp) return;

        const currentTime = new Date(timestamp).getTime();

        if(!timeMap.has(timestamp)) {
            timeMap.set(timestamp, {
                timestamp, 
                minutes: Math.floor((currentTime - baseTimeMs) / 60000),
                totalVotes: 0,
                baseTimestamp: baseTimestampStr // 各ポイントに基準を記録
            });
        }

        const votesRaw = record.cumulative_votes;
        const votes = typeof votesRaw === 'string' ? parseInt(String(votesRaw).replace(/,/g, ''), 10) : votesRaw;

        const point = timeMap.get(record.timestamp)!;
        point[record.party_name] = votes;
        point.totalVotes += votes;
    });

    // Additional calculation of vote percentage for each time point
    return Array.from(timeMap.values()).map(point => {
        const updatePoint = { ...point };
        Object.keys(point).forEach(key => {
            const reservedKeys = ["timestamp", "totalVotes", "minutes", "baseTimestamp"];
            if (!reservedKeys.includes(key)) {
                const votes = point[key] as number;
                updatePoint[`${key}_share`] = point.totalVotes > 0 ? parseFloat(((votes / point.totalVotes) * 100).toFixed(2)) : 0;
            }
        });
        return updatePoint;
    });
};

/**
 * 経過分(minutes)と基準時刻(baseTimestamp)から
 * "25:11" のような表示用文字列を生成する
 */
export const formatChartTime = (minutes: number, baseTimestamp?: string) => {
  if (!baseTimestamp) return "";

  const startDate = new Date(baseTimestamp);
  const currentTickDate = new Date(startDate.getTime() + minutes * 60000);
  
  const h = currentTickDate.getHours();
  const m = currentTickDate.getMinutes();
  
  // 日付をまたぐ場合に24時間を加算して表示
  let displayH = h;
  if (currentTickDate.getDate() !== startDate.getDate()) {
    displayH = h + 24;
  }

  return `${displayH}:${m.toString().padStart(2, '0')}`;
};