/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { formatChartTime } from "../utils/dataProcessor";
import "../components/ElectionChart.css";

// 共通コンポーネント（X軸・Y軸・Tooltip・凡例）のジェネレーター
export const renderCommonChartComponents = (
    baseTimestamp: string | undefined, 
    yAxisFormatter?: (value: any, name?: any, item?: any, index?: any) => any,
    yAxisUnit?: string,
    yAxisDomain?: [number | string, number | string],
    hoveredPartyKey?: string | null
) => [
    <CartesianGrid key="grid" />,
    <XAxis
        key="xaxis"
        dataKey="minutes"
        type="number"
        domain={["dataMin", "dataMax"]}
        allowDataOverflow={true}
        tickFormatter={(value) => formatChartTime(value, baseTimestamp)}
        tick={{ fontSize: 12 }}
    />,
    <YAxis 
        key="yaxis"
        unit={yAxisUnit}
        domain={yAxisDomain}
        tick={{ fontSize: 12 }} 
        tickFormatter={yAxisFormatter} 
        width={yAxisFormatter ? 80 : 60} 
    />,
    <Tooltip 
        key="tooltip"
        shared={false}
        cursor={false}
        wrapperStyle={{ zIndex: 1000 }} // 凡例（Legend）や他の要素の下に回り込むのを防ぐ
        content={<CustomChartTooltip baseTimestamp={baseTimestamp} hoveredPartyKey={hoveredPartyKey} />}
        formatter={yAxisFormatter}
        animationDuration={0}
    />,
    <Legend key="legend" wrapperStyle={{ fontSize: '12px' }} />
];

const CustomChartTooltip = ({ active, payload, label, baseTimestamp, hoveredPartyKey }: any) => {
    if (active && payload && payload.length) {
        const activeItem = hoveredPartyKey 
            ? payload.find((item: any) => item.dataKey === hoveredPartyKey)
            : payload[0];

        if (!activeItem) return null;

        return (
            <div className="custom-chart-tooltip bg-white/95 p-3 border border-slate-200 rounded-lg shadow-xl backdrop-blur-sm min-w-[150px]">
                {/* 時刻・経過時間の表示 */}
                <p className="text-[11px] font-medium text-slate-400 mb-1">
                   ⏱ {formatChartTime(label, baseTimestamp)} ({label}分)
                </p>
                
                <div className="flex items-center justify-between gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        {/* 左側の丸ドット */}
                        <span 
                            className="w-2.5 h-2.5 rounded-full inline-block" 
                            style={{ backgroundColor: activeItem.stroke || activeItem.color }}
                        />
                        
                        {/* 政党名のテキストカラーを、その政党のカラーに */}
                        <span style={{ color: activeItem.stroke || activeItem.color }}>
                            {activeItem.name}
                        </span>
                    </div>
                    
                    {/* 右側の数値 */}
                    <span className="text-slate-900 font-mono" style={{ color: activeItem.stroke || activeItem.color }}>
                        {activeItem.formatter ? activeItem.formatter(activeItem.value) : activeItem.value.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;};