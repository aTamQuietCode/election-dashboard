# Election Data Analysis Dashboard

A web-based dashboard for statistical analysis and visualization of Japanese House of Representatives election results, specifically focusing on intermediate vote count distributions and transitions over time.

---

## Features / 機能概要

### 📊 Statistical Data Visualization (統計データの可視化)
- **Transition of Cumulative Votes (得票数の推移 - 累計)**
  Tracks the total votes gained by each political party as the ballot counting progresses.
  (開票進捗に伴う各政党の累計得票数の推移を可視化)
- **Voting Speed / Incremental Votes (得票速度 - 時間帯ごとの増分)**
  Analyzes the breakdown of incremental votes per specific time interval to detect distribution anomalies or sudden shifts.
  (時間帯ごとの増分票数を算出し、得票の「加速・減速」の推移を詳細に分析)
- **Transition of Voting Share (得票比率の推移 - %)**
  Displays the fluctuating percentage share of each party over time to observe statistical consistency.
  (各政党のシェア（得票比率）の時系列変化を表示し、統計的な不自然さがないかを検証)

### 🔍 Comparative Analysis (多角的な比較機能)
- Supports comparative views across multiple House of Representatives elections.
  (過去の衆議院議員選挙データとの時系列・地域別比較に対応)
- Displays data localized for specific regions, including Kanagawa Prefecture districts and Proportional Representation blocks.
  (神奈川県の各選挙区および比例代表ブロックのデータをカバー)

---

## Data Source / データソース

This dashboard utilizes official, publicly available raw data disclosed by the **Kanagawa Prefecture Election Commission**.
(本ダッシュボードは、**神奈川県選挙管理委員会**が公開した公式の中間開票データおよび確定データを元に構築・検証を行っています。)

---

## Tech Stack / 技術スタック

- **Frontend**: React / TypeScript / Vite
- **Charting**: Recharts (Customized for high-performance mobile-responsive hover and tracking)
- **Styling**: Tailwind CSS