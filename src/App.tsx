import { useEffect, useState, useCallback } from 'react';
import Papa from "papaparse";
import type { ChartDataPoint, RawElectionRecord } from "./types/election";
import { processElectionCSV } from "./utils/dataProcessor";
import { ElectionTable } from "./components/ElectionTable";
import "./App.css";
import { VotingRatioChart } from './components/VotingRatioChart';
import { PartyVotesChart } from './components/PartyVotesChart';
import { VelocityChart } from './components/VelocityChart';

const ELECTIONS = [
  { id: "2026", label: "2026年 衆院選 比例", file: "csv/51shuin_hirei_kanagawa.csv" },
  { id: "2024", label: "2024年 衆院選 比例", file: "csv/50shuin_hirei_kanagawa.csv" },
  { id: "2021", label: "2021年 衆院選 比例", file: "csv/49shuin_hirei_kanagawa.csv" },
]

const App = () => {
  const [selectedId, setSelectedId] = useState<string>(ELECTIONS[0].id);
  const [tableData, setTableData] = useState<ChartDataPoint[]>([]);
  const [parties, setParties] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback((filePath: string) => {
    setLoading(true);
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rawData = results.data as RawElectionRecord[];
            
            // 1. 先に時系列でソート
            const sortedRaw = [...rawData].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            // 2. 横持ちデータにパース
            const processed = processElectionCSV(sortedRaw);
            setTableData(processed);

            // 3. パース後のデータから動的に政党名リストを抽出（確実な方法）
            const extractedParties = processed.length > 0 
              ? Object.keys(processed[0]).filter(key => 
                  !['timestamp', 'minutes', 'totalVotes', 'baseTimestamp', 'total_delta'].includes(key) &&
                  !key.endsWith('_share') && 
                  !key.endsWith('_delta')
                )
              : [];
            
            setParties(extractedParties);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setTableData([]);
        setParties([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const config = ELECTIONS.find(e => e.id === selectedId);
    if (config) {
      loadData(config.file);
    }
  }, [selectedId, loadData]);

  return (
    <div className="App">
      <h1>神奈川県 衆議院議員総選挙 比例代表データ</h1>
      
      {/* switching tab by fiscal year */}
      <div className="election-tabs">
        {ELECTIONS.map((election) => (
          <button
            key={election.id}
            className={`election-tab ${selectedId === election.id ? "active" : ""}`}
            onClick={() => setSelectedId(election.id)}
          >
            {election.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Display the whole progress(total votes) */}
          <PartyVotesChart data={tableData} parties={parties} />

          {/* Display the voting sppeed(incremental votes) */}
          <VelocityChart data={tableData} parties={parties} />

          {/* Display the each party map(ratio). */}
          <VotingRatioChart data={tableData} parties={parties} />

          <div className='election-table'>
            <h3>詳細データテーブル</h3>
            <ElectionTable data={tableData} parties={parties} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;