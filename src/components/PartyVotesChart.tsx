import { LineChart, Line } from "recharts";
import type { ChartDataPoint } from '../types/election';
import { BaseElectionChart } from "./BaseElectionChart";
import { renderCommonChartComponents } from "../utils/chartHelpers";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const PartyVotesChart = ({ data, parties }: Props) => {
    return (
        <BaseElectionChart 
            title="政党別 得票数の推移（累計）" 
            data={data}
            yAxisFormatter={(value) => (value / 10000).toLocaleString() + "万"}
        >
            {({ getPartyColor, yAxisFormatter, yAxisUnit, yAxisDomain }) => (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    
                    {renderCommonChartComponents(data[0]?.baseTimestamp, yAxisFormatter, yAxisUnit, yAxisDomain)}
                    
                    {parties.map((party) => (
                        <Line
                            key={party}
                            dataKey={party}
                            name={party}
                            stroke={getPartyColor(party)}
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 5 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};