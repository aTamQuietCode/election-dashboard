import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { formatChartTime } from "../utils/dataProcessor";

// 共通コンポーネント（X軸・Y軸・Tooltip・凡例）のジェネレーター
export const renderCommonChartComponents = (
    baseTimestamp: string | undefined, 
    yAxisFormatter?: (value: number) => string,
    yAxisUnit?: string,
    yAxisDomain?: [number | string, number | string]
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
        labelFormatter={(value) => formatChartTime(value, baseTimestamp)}
        contentStyle={{ fontSize: '12px' }}
    />,
    <Legend key="legend" />
];