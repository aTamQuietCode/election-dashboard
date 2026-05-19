import type { TripleElectionChartData } from '../types/election'; // 🔒 インポート
import { SingleElectionChart } from './SingleElectionChart';
import type { ChartType } from './SingleElectionChart';
import "./ElectionChart.css";
import { useState } from 'react';

interface SyncElectionChartsProps {
    data: TripleElectionChartData; // 共通定義の型を使用
    regionName: string;
}

export const SyncElectionCharts: React.FC<SyncElectionChartsProps> = ({ data, regionName }) => {
    const [activeMode, setActiveMode] = useState<ChartType>("votes");

    const tabs: {id: ChartType; label: string; colorClass: string, bgClass: string}[] = [
        { id: 'votes', label: '📊 総得票数の推移', colorClass: 'border-blue-600 text-blue-600', bgClass: 'bg-blue-50' },
        { id: 'velocity', label: '⚡ 得票速度(増分) の推移', colorClass: 'border-amber-500 text-amber-500', bgClass: 'bg-amber-50' },
        { id: 'ratio', label: '📈 得票比率(%) の推移', colorClass: 'border-emerald-600 text-emerald-600', bgClass: 'bg-emerald-50' }
    ]

    return (
        <div className="sync-election-dashboard space-y-6 p-2">
            {/* ヘッダーエリア */}
            <div className="border-b pb-4 border-gray-200">
                <h2 className="text-2xl font-black text-gray-800">{regionName} - 衆院選 過去3回同期スクロール</h2>
                <p className="text-sm text-gray-500 mt-1">
                    ※ボタンで切り替えた各モードの3世代グラフは、開票経過時間（X軸）のホバー位置が完全に同期します。
                </p>
            </div>

            {/* モード切り替えボタン */}
            <div className="switching-tabs">
                {tabs.map((tab) => {
                    const isActive = activeMode === tab.id;
                    return (
                        <button
                            key={tab.id}
                            className={`switching-tabs-button ${ isActive ? "active" : ""}`}
                            onClick={() => setActiveMode(tab.id)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* 選択されたモードに応じたグラフグループの動的レンダリング */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 transition-all">
                {activeMode === 'votes' && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                            政党別 得票数の推移（累計）
                        </h3>
                        <div className="flex flex-col space-y-4">
                            <SingleElectionChart title="2021年 (第49回衆院選)" data={data.election2021} type="votes" />
                            <SingleElectionChart title="2024年 (第50回衆院選)" data={data.election2024} type="votes" />
                            <SingleElectionChart title="2026年 (第51回衆院選)" data={data.election2026} type="votes" />
                        </div>
                    </>
                )}

                {activeMode === 'velocity' && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-3">
                            得票速度（時間帯ごとの増分票数）
                        </h3>
                        <div className="flex flex-col space-y-4">
                            <SingleElectionChart title="2021年 (第49回衆院選)" data={data.election2021} type="velocity" />
                            <SingleElectionChart title="2024年 (第50回衆院選)" data={data.election2024} type="velocity" />
                            <SingleElectionChart title="2026年 (第51回衆院選)" data={data.election2026} type="velocity" />
                        </div>
                    </>
                )}

                {activeMode === 'ratio' && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-600 pl-3">
                            得票比率(%) の推移
                        </h3>
                        <div className="flex flex-col space-y-4">
                            <SingleElectionChart title="2021年 (第49回衆院選)" data={data.election2021} type="ratio" />
                            <SingleElectionChart title="2024年 (第50回衆院選)" data={data.election2024} type="ratio" />
                            <SingleElectionChart title="2026年 (第51回衆院選)" data={data.election2026} type="ratio" />
                        </div>
                    </>
                )}
                
            </div>

        </div>
    );
};