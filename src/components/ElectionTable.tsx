import type { ChartDataPoint } from "../types/election";
import "./ElectionTable.css";

interface Prpps {
    data: ChartDataPoint[];
    parties: string[];
}

export const ElectionTable = ({ data, parties }: Prpps) => {
    return (
        <div className="election-table">
            <table>
                <thead>
                    <tr>
                        <th>時間</th>
                        <th>合計得票数</th>
                        {parties.map(party => (
                            <th key={party}>{party}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.timestamp.toString()}</td>
                            <td>{row.totalVotes.toLocaleString()}</td>
                            {parties.map(party => {
                            const votes = row[party] || 0;
                            const share = row[`${party}_share`] || 0;
                            return (
                                <td key={party}>
                                    <div>{votes.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.75em', color: '#1a73e8' }}>{share.toLocaleString()}%</div>
                                </td>
                            );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};