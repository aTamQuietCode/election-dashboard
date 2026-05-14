import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartDataPoint } from "../types/election";
import "./ElectionChart.css";
import { formatChartTime } from "../utils/dataProcessor";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const VotingRatioChart = ({ data, parties }: Props) => {
    // 基準時刻はデータの最初の要素から取得
    const baseTimestamp = data[0]?.baseTimestamp;

    if (!data || data.length === 0) return <p>No data available for chart.</p>;
    return (
        <div className="election-chart">
            <h3>得票比率(%)の推移</h3>
            <div className="chart-container">
                <ResponsiveContainer >
                    <LineChart data={data} >
                        <CartesianGrid />
                        <XAxis 
                            dataKey="minutes"
                            type="number"
                            domain={[0, "auto"]}
                            hide={false}
                            tickFormatter={(value) => formatChartTime(value, baseTimestamp)}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                        <Tooltip 
                            labelFormatter={(value) => formatChartTime(value, baseTimestamp)}
                            contentStyle={{ fontSize: '12px' }}
                        />
                        <Legend />
                        {parties.map((party, index) => (
                            <Line
                                key={party}
                                dataKey={`${party}_share`}
                                name={party}
                                stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                                strokeWidth={2}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};