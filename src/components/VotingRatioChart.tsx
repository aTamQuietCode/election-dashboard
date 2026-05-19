import { LineChart, Line } from "recharts";
import type { ChartDataPoint } from "../types/election";
import { BaseElectionChart } from "./BaseElectionChart";
import { renderCommonChartComponents } from "../utils/chartHelpers";
import "./ElectionChart.css";
import { useState } from "react";

interface Props {
    data: ChartDataPoint[];
    parties: string[];
}

export const VotingRatioChart = ({ data, parties }: Props) => {
    const [hoveredPartyKey, setHoveredPartyKey] = useState<string | null>(null);

    return (
        <BaseElectionChart 
            title="得票比率(%)の推移" 
            data={data} yAxisUnit="%"
        >
            {({ getPartyColor }) => (
                <LineChart 
                    data={data} 
                    className='line-chart-container'
                    accessibilityLayer={false}
                    onMouseLeave={() => setHoveredPartyKey(null)}
                >
                    {renderCommonChartComponents(data[0]?.baseTimestamp, undefined, "%", undefined, hoveredPartyKey)}

                    {parties.map((party) => {
                        const currentDataKey = `${party}_share`;
                        return (
                            <Line
                                key={party}
                                dataKey={`${party}_share`}
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
                                    if (hoveredPartyKey !== currentDataKey) setHoveredPartyKey(currentDataKey);
                                }}
                                
                                // スマホ用
                                onTouchStart={() => setHoveredPartyKey(currentDataKey)}
                                onTouchMove={() => {
                                    if (hoveredPartyKey !== currentDataKey) setHoveredPartyKey(currentDataKey);
                                }}
                            />
                        );
                    })}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};