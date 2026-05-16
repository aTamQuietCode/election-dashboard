import type { ChartDataPoint, RawElectionRecord } from "../types/election";

export const processElectionCSV = (rawData: RawElectionRecord[]): ChartDataPoint[] => {
  // 1. 有効なデータから最小時間を特定（基準点の動的取得）
  const validData = rawData.filter(d => d && d.timestamp && !isNaN(new Date(d.timestamp).getTime()));
  if (validData.length === 0) return [];

  const sortedByTime = [...validData].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const baseDate = new Date(sortedByTime[0].timestamp);
  const baseTimeMs = baseDate.getTime();
  const baseTimestampStr = sortedByTime[0].timestamp;

  // 2. 時刻(timestamp)をキーにしたMapで、同一時刻の複数政党データを1つにまとめる
  const timeMap = new Map<string, ChartDataPoint>();

  rawData.forEach((rec) => {
    if (!rec || !rec.timestamp || !rec.party_name) return;
    
    const timestamp = String(rec.timestamp).trim();
    const partyName = String(rec.party_name).trim();
    const votes = parseInt(String(rec.cumulative_votes).replace(/,/g, ''), 10) || 0;
    const currentTime = new Date(timestamp).getTime();

    // まだその時刻の器（オブジェクト）がなければ作成
    if (!timeMap.has(timestamp)) {
      timeMap.set(timestamp, {
        timestamp,
        minutes: Math.floor((currentTime - baseTimeMs) / 60000),
        totalVotes: 0,
        baseTimestamp: baseTimestampStr
      });
    }

    const point = timeMap.get(timestamp)!;
    // その政党の票数をセットし、総得票数に加算
    point[partyName] = votes;
    point.totalVotes += votes;
  });

  // 3. 時間順（minutes順）にソート
  const sortedPoints = Array.from(timeMap.values()).sort((a, b) => a.minutes - b.minutes);

  // 4. 増分（Delta）と 得票率（Share）の計算
  return sortedPoints.map((point, index) => {
    const updatedPoint = { ...point };
    const prevPoint = index > 0 ? sortedPoints[index - 1] : null;

    // 票数が含まれている政党名のキーだけを抽出
    const reservedKeys = ['timestamp', 'totalVotes', 'minutes', 'baseTimestamp'];
    const partyNames = Object.keys(point).filter(key => !reservedKeys.includes(key));

    partyNames.forEach(partyName => {
      const currentVotes = point[partyName] as number || 0;
      const prevVotes = prevPoint ? (prevPoint[partyName] as number || 0) : 0;

      // ① 増分（得票速度用）の計算
      const delta = Math.max(0, currentVotes - prevVotes);
      updatedPoint[`${partyName}_delta`] = delta;

      // ② 得票率（比率用）の計算
      updatedPoint[`${partyName}_share`] = point.totalVotes > 0 
        ? parseFloat(((currentVotes / point.totalVotes) * 100).toFixed(2)) 
        : 0;
    });

    // 総数の増分も計算
    const prevTotal = prevPoint ? prevPoint.totalVotes : 0;
    updatedPoint['total_delta'] = Math.max(0, point.totalVotes - prevTotal);

    return updatedPoint;
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