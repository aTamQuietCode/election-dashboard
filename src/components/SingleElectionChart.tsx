import { LineChart, Line } from 'recharts';
import type { ChartDataPoint } from '../types/election';
import { BaseElectionChart } from './BaseElectionChart';
import { renderCommonChartComponents } from "../utils/chartHelpers";
import "./ElectionChart.css";
import { useState } from 'react';

// 表示するグラフの種類を定義
export type ChartType = 'votes' | 'ratio' | 'velocity';

interface SingleElectionChartProps {
    title: string;
    data: ChartDataPoint[];
    type: ChartType;
}

export const SingleElectionChart: React.FC<SingleElectionChartProps> = ({ title, data, type }) => {
    const allKeys = data.length > 0 ? Object.keys(data[0]) : [];
    const [hoveredPartyKey, setHoveredPartyKey] = useState<string | null>(null);

    // モードに応じて、Rechartsに渡す実際の dataKey と 画面に表示する name を出し分ける
    const getChartConfig = () => {
        switch(type) {
            case "ratio":
                return allKeys
                    .filter(key => key.endsWith('_share') && !key.startsWith('total'))
                    .map(key => ({ dataKey: key, displayName: key.replace("_share", "")}));
            case "velocity":
                return allKeys
                    .filter(key => key.endsWith('_delta') && !key.startsWith('total'))
                    .map(key => ({ dataKey: key, displayName: key.replace('_delta', '')}));
            case "votes": {
                    const systemKeys = ['timestamp', 'minutes', 'totalVotes', 'baseTimestamp', 'total_delta', 'total_share'];
                    return allKeys.filter(key => !systemKeys.includes(key) && !key.endsWith("_share") && !key.endsWith("_delta"))
                        .map(key => ({
                            dataKey: key,
                            displayName: key
                        }));
                    }
            default:
                return [];
        }
    };

    const chartConfigs = getChartConfig();

    const yAxisPpps = {
        yAxisFormatter: type === "ratio" ? undefined : (v: number) => type === "votes" ? (v / 10000).toLocaleString() + "万" : v.toLocaleString(),
        yAxisUnit: type === "ratio" ? "%" : undefined
    };
    
    return (
        <BaseElectionChart title={title} data={data} yAxisFormatter={yAxisPpps.yAxisFormatter} yAxisUnit={yAxisPpps.yAxisUnit}>
            
            {({ getPartyColor, yAxisFormatter, yAxisUnit, yAxisDomain }) => (
                <LineChart 
                    data={data} 
                    className='line-chart-container'
                    accessibilityLayer={false}
                    onMouseLeave={() => setHoveredPartyKey(null)}
                >
                    {renderCommonChartComponents(data[0]?.baseTimestamp, yAxisFormatter, yAxisUnit, yAxisDomain, hoveredPartyKey)}
                    
                    {chartConfigs.map(config => {
                        
                        return (
                            <Line
                                key={config.dataKey}
                                dataKey={config.dataKey}
                                name={config.displayName}
                                stroke={getPartyColor(config.displayName.replace('(時速)', ''))}
                                strokeWidth={2}
                                opacity={1}
                                dot={{ r: 2 }}
                                activeDot={{ r: 10, 
                                    strokeWidth: 0, 
                                    fill: 'transparent', 
                                }}
                                connectNulls

                                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                
                                onMouseEnter={() => setHoveredPartyKey(config.dataKey)}
                                onMouseOver={() => {
                                    if (hoveredPartyKey !== config.dataKey) {
                                        setHoveredPartyKey(config.dataKey);
                                    }
                                }}
                            />
                        );
                    })}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};