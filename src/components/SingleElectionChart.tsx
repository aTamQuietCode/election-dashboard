import { LineChart, Line } from 'recharts';
import type { ChartDataPoint } from '../types/election';
import { BaseElectionChart } from './BaseElectionChart';
import { renderCommonChartComponents } from "../utils/chartHelpers";

interface SingleElectionChartProps {
    title: string;
    data: ChartDataPoint[];
    syncId: string;
}

export const SingleElectionChart: React.FC<SingleElectionChartProps> = ({ title, data, syncId }) => {
    // 1行目のデータから動的に政党名のキーのみを抽出
    const reservedKeys = ['timestamp', 'minutes', 'totalVotes', 'baseTimestamp', 'total_delta'];
    const partyKeys = data.length > 0 
        ? Object.keys(data[0]).filter(key => 
            !reservedKeys.includes(key) && !key.endsWith('_share') && !key.endsWith('_delta')
          )
        : [];

    return (
        <BaseElectionChart title={title} data={data} syncId={syncId}>
            {/* 🔒 getPartyColor を使って一貫性のある政党カラーでLineを描画 */}
            {({ getPartyColor }) => (
                <LineChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {renderCommonChartComponents(data[0]?.baseTimestamp)}
                    {partyKeys.map(party => (
                        <Line
                            key={party}
                            dataKey={party}
                            name={party}
                            stroke={getPartyColor(party)} // 🔒 ここで一元管理されたカラーが適用されます
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            )}
        </BaseElectionChart>
    );
};