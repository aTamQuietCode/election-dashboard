import { LineChart, Line } from "recharts";
import type { ChartDataPoint } from "../types/election";
import { BaseElectionChart } from "./BaseElectionChart";
import { renderCommonChartComponents } from "../utils/chartHelpers";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const VotingRatioChart = ({ data, parties }: Props) => {
    return (
        <BaseElectionChart title="得票比率(%)の推移" data={data} yAxisUnit="%">
            {({ getPartyColor }) => (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {renderCommonChartComponents(data[0]?.baseTimestamp, undefined, "%")}
                    {parties.map((party) => (
                        <Line
                            key={party}
                            dataKey={`${party}_share`}
                            name={party}
                            stroke={getPartyColor(party)}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                            strokeWidth={2}
                            connectNulls
                        />
                    ))}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};