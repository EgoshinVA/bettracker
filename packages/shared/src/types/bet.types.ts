import { BetResult } from '../enums/bet-result.enum'
import { BetType } from '../enums/bet-type.enum'

export interface Bet {
  id: string
  sport: string
  league: string
  match: string
  odds: number
  stake: number
  betType: BetType
  result: BetResult
  notes: string | null
  profit: number | null
  bookmakerId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBetRequest {
  sport: string
  league: string
  match: string
  odds: number
  stake: number
  betType: BetType
  notes?: string
  bookmakerId?: string
}

export interface UpdateBetResultRequest {
  result: BetResult
}

export interface BetStats {
  totalBets: number
  settledBets: number
  winRate: number
  roi: number
  roiDelta: number
  netProfit: number
  netProfitMonthly: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
