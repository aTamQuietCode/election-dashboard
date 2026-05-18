import type { TripleElectionChartData } from '../types/election'; // 🔒 インポート
import { SingleElectionChart } from './SingleElectionChart';

interface SyncElectionChartsProps {
    data: TripleElectionChartData; // 🔒 共通定義の型を使用
    regionName: string;
}

export const SyncElectionCharts: React.FC<SyncElectionChartsProps> = ({ data, regionName }) => {
    const SYNC_ID = "electionTimeSync";

    return (
        <div className="w-full space-y-6 p-2">
            <div className="border-b pb-3 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                    {regionName} - 衆院選 過去3回推移比較（得票数累計）
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    ※各グラフのホバー位置（開票開始からの経過分数）は完全に同期しています。
                </p>
            </div>

            {/* 3列グリッド配置（大画面時は横並び、ノートPC等ではレスポンシブ） */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SingleElectionChart 
                    title="2021年 (第49回衆院選)" 
                    data={data.election2021} 
                    syncId={SYNC_ID} 
                />
                <SingleElectionChart 
                    title="2024年 (第50回衆院選)" 
                    data={data.election2024} 
                    syncId={SYNC_ID} 
                />
                <SingleElectionChart 
                    title="2026年 (第51回衆院選 - 2月8日)" 
                    data={data.election2026} 
                    syncId={SYNC_ID} 
                />
            </div>
        </div>
    );
};