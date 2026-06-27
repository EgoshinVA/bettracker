export type BetResult = 'WON' | 'LOST' | 'PENDING'
export type BetType = 'moneyline' | 'spread' | 'over_under' | 'parlay' | 'btts'

export interface Bet {
  id: string
  date: string
  event: string
  league: string
  betType: string
  odds: number
  stake: number
  result: BetResult
  profit?: number
}

export interface DashboardStats {
  roi: number
  roiDelta: number
  totalBets: number
  winRate: number
  netProfit: number
  netProfitMonthly: number
}

export interface Bookmaker {
  id: string
  name: string
  shortName: string
  color: string
  volume: number
  volumePct: number
  roi: number
}

export interface AnalyticsSport {
  sport: string
  pct: number
  color: string
}
