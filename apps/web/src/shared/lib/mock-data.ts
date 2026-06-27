import type { Bet, DashboardStats, Bookmaker, AnalyticsSport } from './types'

export const mockStats: DashboardStats = {
  roi: 12.4,
  roiDelta: 12.4,
  totalBets: 142,
  winRate: 58,
  netProfit: 2450,
  netProfitMonthly: 2450,
}

export const mockBets: Bet[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    event: 'Man City vs Arsenal',
    league: 'Premier League',
    betType: 'Match Winner (City)',
    odds: 1.85,
    stake: 200,
    result: 'WON',
    profit: 170,
  },
  {
    id: '2',
    date: 'Oct 23, 2023',
    event: 'Lakers vs Warriors',
    league: 'NBA Season',
    betType: 'Over 224.5 Pts',
    odds: 1.91,
    stake: 150,
    result: 'LOST',
    profit: -150,
  },
  {
    id: '3',
    date: 'Oct 23, 2023',
    event: 'Real Madrid vs Barca',
    league: 'La Liga',
    betType: 'BTTS - Yes',
    odds: 1.72,
    stake: 500,
    result: 'PENDING',
  },
  {
    id: '4',
    date: 'Oct 22, 2023',
    event: 'Novak Djokovic vs Alcaraz',
    league: 'ATP Masters',
    betType: 'Set Winner (2nd)',
    odds: 2.1,
    stake: 100,
    result: 'WON',
    profit: 110,
  },
  {
    id: '5',
    date: 'Oct 22, 2023',
    event: 'Chiefs vs Eagles',
    league: 'NFL MNF',
    betType: 'Spread (-3.5)',
    odds: 1.95,
    stake: 250,
    result: 'WON',
    profit: 237,
  },
]

export const mockBookmakers: Bookmaker[] = [
  { id: '1', name: 'Bet365', shortName: 'B365', color: '#00A651', volume: 45200, volumePct: 42, roi: 16.2 },
  { id: '2', name: 'FanDuel', shortName: 'FD', color: '#1493FF', volume: 32100, volumePct: 28, roi: 11.4 },
  { id: '3', name: 'DraftKings', shortName: 'DK', color: '#53D337', volume: 18400, volumePct: 15, roi: -2.1 },
  { id: '4', name: 'Pinnacle', shortName: 'PIN', color: '#E63946', volume: 56700, volumePct: 15, roi: 18.9 },
]

export const mockSports: AnalyticsSport[] = [
  { sport: 'NBA', pct: 40, color: '#7c3aed' },
  { sport: 'NFL', pct: 25, color: '#8b5cf6' },
  { sport: 'Soccer', pct: 20, color: '#a78bfa' },
  { sport: 'Tennis', pct: 15, color: '#c4b5fd' },
]

export const mockProfitData = [
  { date: 'May 01', profit: 800, avg: 600 },
  { date: 'May 08', profit: 1200, avg: 900 },
  { date: 'May 15', profit: 950, avg: 1000 },
  { date: 'May 22', profit: 1800, avg: 1200 },
  { date: 'May 29', profit: 2450, avg: 1500 },
]
