import type { ChartDataPoint } from '../types/election';
import { Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import "./ElectionChart.css";
import { formatChartTime } from "../utils/dataProcessor";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const PartyVotesChart = ({ data, parties }: Props) => {
    // 基準時刻はデータの最初の要素から取得
    const baseTimestamp = data[0]?.baseTimestamp;
    return (
        <div className='election-chart'>
            <h3>政党別 得票数の推移（累計）</h3>
            <div className='chart-container'>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid />
                        <XAxis 
                            dataKey="minutes"
                            type="number"
                            domain={["dataMin", "dataMax"]}
                            hide={false}
                            tickFormatter={(value) => formatChartTime(value, baseTimestamp)}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => (value / 10000).toLocaleString() + "万"} width={80} />
                        <Tooltip 
                            labelFormatter={(value) => formatChartTime(value, baseTimestamp)}
                            contentStyle={{ fontSize: '12px' }}
                        />
                        <Legend />
                        {parties.map((party, index) => (
                            <Area
                                key={party}
                                dataKey={party}
                                name={party}
                                stackId="1"
                                stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                                fill={`hsl(${(index * 137.5) % 360}, 70%, 60%)`}
                                fillOpacity={0.6}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}