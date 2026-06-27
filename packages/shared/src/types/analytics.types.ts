export interface DashboardStats {
  totalBets: number
  settledBets: number
  winRate: number
  roi: number
  roiDelta: number
  netProfit: number
  netProfitMonthly: number
}

export interface ProfitDataPoint {
  date: string
  profit: number
  avg: number
}

export interface SportDistribution {
  sport: string
  bets: number
  pct: number
}

export interface BookmakerYield {
  id: string
  name: string
  volume: number
  roi: number
  volumePct: number
}

export interface AnalyticsOverview {
  totalProfit: number
  winRate: number
  roi: number
  avgOdds: number
  profitOverTime: ProfitDataPoint[]
  sportDistribution: SportDistribution[]
  bookmakerYield: BookmakerYield[]
}
