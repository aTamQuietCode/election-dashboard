import { LineChart, Line } from "recharts";
import type { ChartDataPoint } from "../types/election";
import { BaseElectionChart } from "./BaseElectionChart";
import { renderCommonChartComponents } from "../utils/chartHelpers";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const VelocityChart = ({ data, parties }: Props) => {
    return (
        <BaseElectionChart 
            title="得票速度（時間帯ごとの増分票数）" 
            data={data}
            yAxisFormatter={(value) => value.toLocaleString()}
        >
            {({ getPartyColor }) => (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {renderCommonChartComponents(data[0]?.baseTimestamp, (v) => v.toLocaleString())}
                    {parties.map((party) => (
                        // 速度グラフ特有の HSLステップ幅(35) を反映してカラー生成
                        <Line 
                            key={party}
                            dataKey={`${party}_delta`}
                            name={`${party}(時速)`}
                            //stroke={`hsl(${(index * 35) % 360}, 70%, 50%)`}
                            stroke={getPartyColor(party)}
                            dot={true}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};