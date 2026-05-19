import { useEffect, useState, useCallback } from 'react';
import Papa from "papaparse";
import type { ChartDataPoint, RawElectionRecord } from "./types/election";
import { processElectionCSV } from "./utils/dataProcessor";
import { ElectionTable } from "./components/ElectionTable";
import "./App.css";
import { VotingRatioChart } from './components/VotingRatioChart';
import { PartyVotesChart } from './components/PartyVotesChart';
import { VelocityChart } from './components/VelocityChart';
import { SyncElectionCharts } from './components/SyncElectionCharts';

const ELECTIONS = [
  { id: "2026", label: "2026年 衆院選 比例", file: "/csv/51shuin_hirei_kanagawa.csv", baseTime: "2026/02/08 20:00" },
  { id: "2024", label: "2024年 衆院選 比例", file: "/csv/50shuin_hirei_kanagawa.csv", baseTime: "2024/10/27 20:00" },
  { id: "2021", label: "2021年 衆院選 比例", file: "/csv/49shuin_hirei_kanagawa.csv", baseTime: "2021/10/31 20:00" },
]

interface AllElectionsData {
  "2026": ChartDataPoint[];
  "2024": ChartDataPoint[];
  "2021": ChartDataPoint[];
}

const App = () => {
  const [selectedId, setSelectedId] = useState<string>(ELECTIONS[0].id);  
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);     // モード切替フラグ
  const [tableData, setTableData] = useState<ChartDataPoint[]>([]);
  const [parties, setParties] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [allData, setAllData] = useState<AllElectionsData>({ "2026": [], "2024": [], "2021": [] });

  // 1ファイルだけ読み込む単一年度用
  const loadSingleData = useCallback((filePath: string, baseTime: string) => {
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
            const raw = results.data as RawElectionRecord[];
            const processed = processElectionCSV(raw, baseTime);
            setTableData(processed);

            const extracted = processed.length > 0 ? Object.keys(processed[0]).filter(key => 
              !["timestamp", "minutes", "totalVotes", "baseTimestamp", "total_delta"].includes(key) &&
              !key.endsWith("_share") &&
              !key.endsWith("_delta")
            )
            : [];

            setParties(extracted);
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

  // 3つのCSVを同時に Promise.all で全ロードする関数（比較モード用）
  const loadAllElectionsData = useCallback(() => {
    setLoading(true);
    
    const promises = ELECTIONS.map(e => 
      fetch(e.file)
        .then(res => res.text())
        .then(csvText => {
          return new Promise<ChartDataPoint[]>((resolve) => {
            Papa.parse(csvText, {
              header: true, 
              skipEmptyLines: true, 
              dynamicTyping: true,
              complete: (results) => {
                const raw = results.data as RawElectionRecord[];
                // すべて 20:00 基準で時間を正規化
                const processed = processElectionCSV(raw, e.baseTime);
                resolve(processed); // 🔒 ここで ChartDataPoint[] が確定する
              }
            });
          });
        })
    );

    Promise.all(promises)
      .then(([data2026, data2024, data2021]) => {
        setAllData({
          "2026": data2026,
          "2024": data2024,
          "2021": data2021
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load all CSVs:", err);
        setLoading(false);
      });
  }, []);

  // モード変更・タブ変更を監視するEffect
  useEffect(() => {
    // 非同期の即時実行関数 (IIFE) にして、コールスタックを同期レンダリングから切り離す
    const fetchData = async () => {
      if (isCompareMode) {
        await loadAllElectionsData();
      } else {
        const config = ELECTIONS.find(e => e.id === selectedId);
        if (config) {
          loadSingleData(config.file, config.baseTime);  
        }
      }
    };
    fetchData();
  }, [selectedId, isCompareMode, loadSingleData, loadAllElectionsData]);

  return (
    <div className="App">
      <h1>神奈川県 衆議院議員総選挙 比例代表データ</h1>

      {/* モードコントロール（表示切り替え用ボタン） */}
      <div className="mode-controls">
        <button 
          className={`mode-btn ${!isCompareMode ? "active" : ""}`}
          onClick={() => setIsCompareMode(false)}
        >
          単一年度表示
        </button>
        <button 
          className={`mode-btn ${isCompareMode ? "active" : ""}`}
          onClick={() => setIsCompareMode(true)}
        >
          📊 過去3回分を並べて比較
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner"><p>|</p></div>
      ) : isCompareMode ? (
        /* 比較モード時のレンダリング（3連動グラフ） */
        <div className="compare-view-container">
          <SyncElectionCharts
            data={{
              election2021: allData["2021"],
              election2024: allData["2024"],
              election2026: allData["2026"]
            }} 
            regionName="神奈川県比例ブロック"
          />
        </div>
      ) : (
        /* 通常モード時のレンダリング（従来通り） */
        <div className="single-view-container">
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

          {/* Display the whole progress(total votes) */}
          <PartyVotesChart data={tableData} parties={parties} />

          {/* Display the voting sppeed(incremental votes) */}
          <VelocityChart data={tableData} parties={parties} />

          {/* Display the each party map(ratio). */}
          <VotingRatioChart data={tableData} parties={parties} />

          <div className='election-table'>
            <h3>詳細データテーブル ({selectedId}年)</h3>
            <ElectionTable data={tableData} parties={parties} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;