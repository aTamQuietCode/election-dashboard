import type React from "react";
import type { ChartDataPoint } from "../types/election";
import { ResponsiveContainer } from "recharts";
import { PARTY_COLORS } from '../types/election';
import "./ElectionChart.css";

interface RenderPropsParams {
    getPartyColor: (partyName: string) => string;
    yAxisFormatter?: (value: number) => string;
    yAxisUnit?: string;
    yAxisDomain?: [number | string, number | string];
}

interface BaseElectionChartProps {
    title: string;
    data: ChartDataPoint[];
    yAxisFormatter?: (value: number) => string;
    yAxisUnit?: string;
    yAxisDomain?: [number | string, number | string];
    syncId?: string;
    children: (props: RenderPropsParams) => React.ReactNode;
}

export const BaseElectionChart: React.FC<BaseElectionChartProps> = ({
    title,
    data,
    yAxisFormatter,
    yAxisUnit,
    yAxisDomain = [0, 'auto'],
    children
}) => {

    if (!data || data.length === 0) {
        return <p className="no-data-msg">{title}: データがありません。</p>;
    }

    const getPartyColor = (partyName: string): string => {
        return PARTY_COLORS[partyName] || "#9ca3af";
    };

    return (
        <div className='election-chart'>
            <h3>{title}</h3>
            <div className='chart-container'>
                <ResponsiveContainer width='100%' height={400}>
                    <div style={{ width: '100%', height: '100%' }}>
                        {children({ 
                            getPartyColor,
                            yAxisFormatter,
                            yAxisUnit,
                            yAxisDomain
                        })}
                    </div>
                </ResponsiveContainer>
            </div>
        </div>
    );
};