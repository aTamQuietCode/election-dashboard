import { CartesianGrid, Legend, LineChart, ResponsiveContainer, XAxis, YAxis, Line, Tooltip } from "recharts";
import type { ChartDataPoint } from "../types/election";
import { formatChartTime } from "../utils/dataProcessor";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const VelocityChart = ({ data, parties }: Props) => {
    const baseTimestamp = data[0]?.baseTimestamp;
    if (!data || data.length === 0) return <p>No data available for chart.</p>;

    return (
        <div className="election-chart">
            <h3>得票速度（時間帯ごとの増分票数）</h3>
            <div className="chart-container">
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={data}>
                        <CartesianGrid />
                        <XAxis 
                            dataKey={"minutes"}
                            type="number"
                            domain={[0, "dataMax"]}
                            allowDataOverflow={true}
                            hide={false}
                            tickFormatter={(val) => formatChartTime(val, baseTimestamp)}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis tickFormatter={(val) => val.toLocaleString()} />
                        <Tooltip
                            labelFormatter={(value) => formatChartTime(value, baseTimestamp)}
                            contentStyle={{ fontSize: '12px' }}
                        />
                        <Legend />
                        {parties.map((party, index) => (
                            <Line 
                                key={party}
                                dataKey={`${party}_delta`}
                                name={`${party}(時速)`}
                                stroke={`hsl(${(index * 35) % 360}, 70%, 50%)`}
                                dot={true}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};