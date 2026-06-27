import type { Bet, DashboardStats, BookmakerDisplay, AnalyticsSport } from './types'
import { BetResult, BetType } from './types'

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
    sport: 'Football',
    league: 'Premier League',
    match: 'Man City vs Arsenal',
    betType: BetType.MONEYLINE,
    odds: 1.85,
    stake: 200,
    result: BetResult.WON,
    notes: null,
    profit: 170,
    createdAt: '2023-10-24T18:00:00.000Z',
    updatedAt: '2023-10-24T20:30:00.000Z',
  },
  {
    id: '2',
    sport: 'Basketball',
    league: 'NBA Season',
    match: 'Lakers vs Warriors',
    betType: BetType.OVER_UNDER,
    odds: 1.91,
    stake: 150,
    result: BetResult.LOST,
    notes: null,
    profit: -150,
    createdAt: '2023-10-23T17:00:00.000Z',
    updatedAt: '2023-10-23T22:00:00.000Z',
  },
  {
    id: '3',
    sport: 'Football',
    league: 'La Liga',
    match: 'Real Madrid vs Barca',
    betType: BetType.BTTS,
    odds: 1.72,
    stake: 500,
    result: BetResult.PENDING,
    notes: null,
    profit: null,
    createdAt: '2023-10-23T12:00:00.000Z',
    updatedAt: '2023-10-23T12:00:00.000Z',
  },
  {
    id: '4',
    sport: 'Tennis',
    league: 'ATP Masters',
    match: 'Djokovic vs Alcaraz',
    betType: BetType.MONEYLINE,
    odds: 2.1,
    stake: 100,
    result: BetResult.WON,
    notes: null,
    profit: 110,
    createdAt: '2023-10-22T14:00:00.000Z',
    updatedAt: '2023-10-22T17:00:00.000Z',
  },
  {
    id: '5',
    sport: 'American Football',
    league: 'NFL MNF',
    match: 'Chiefs vs Eagles',
    betType: BetType.SPREAD,
    odds: 1.95,
    stake: 250,
    result: BetResult.WON,
    notes: null,
    profit: 237,
    createdAt: '2023-10-22T19:00:00.000Z',
    updatedAt: '2023-10-23T00:00:00.000Z',
  },
]

export const mockBookmakers: BookmakerDisplay[] = [
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
