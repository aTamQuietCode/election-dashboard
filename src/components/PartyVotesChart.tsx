import { LineChart, Line } from "recharts";
import type { ChartDataPoint } from '../types/election';
import { BaseElectionChart } from "./BaseElectionChart";
import { renderCommonChartComponents } from "../utils/chartHelpers";
import "./ElectionChart.css";
import { useState } from "react";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const PartyVotesChart = ({ data, parties }: Props) => {
    const [hoveredPartyKey, setHoveredPartyKey] = useState<string | null>(null);

    return (
        <BaseElectionChart 
            title="政党別 得票数の推移（累計）" 
            data={data}
            yAxisFormatter={(value) => (value / 10000).toLocaleString() + "万"}
        >
            {({ getPartyColor, yAxisFormatter, yAxisUnit, yAxisDomain }) => (
                <LineChart 
                    data={data} 
                    className='line-chart-container'
                    accessibilityLayer={false}
                    onMouseLeave={() => setHoveredPartyKey(null)}
                >
                    
                    {renderCommonChartComponents(data[0]?.baseTimestamp, yAxisFormatter, yAxisUnit, yAxisDomain, hoveredPartyKey)}
                    
                    {parties.map((party) => (
                        <Line
                            key={party}
                            dataKey={party}
                            name={party}
                            stroke={getPartyColor(party)}
                            strokeWidth={2}
                            opacity={1}
                            dot={{ r: 2 }}
                            activeDot={{ 
                                r: 24, 
                                strokeWidth: 0, 
                                fill: 'transparent'
                            }}
                            connectNulls
                            
                            // PC用
                            onMouseOver={() => {
                                if (hoveredPartyKey !== party) setHoveredPartyKey(party);
                            }}

                            // スマホ用
                            onTouchStart={() => setHoveredPartyKey(party)}
                            onTouchMove={() => {
                                if (hoveredPartyKey !== party) setHoveredPartyKey(party);
                            }}
                        />
                    ))}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};