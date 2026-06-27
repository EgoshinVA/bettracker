// Single source of truth — re-exported from @bettracker/shared
export type { User, Bet, BetStats, CreateBetRequest, UpdateBetResultRequest, PaginatedResponse } from '@bettracker/shared'
export type { LoginRequest, RegisterRequest, AuthTokens, AuthResponse, RefreshTokenRequest } from '@bettracker/shared'
export { BetResult, BetType, UserRole, SubscriptionStatus } from '@bettracker/shared'

// ── Web-app display types (not part of API contract) ──────────────────────────

export interface DashboardStats {
  roi: number
  roiDelta: number
  totalBets: number
  winRate: number
  netProfit: number
  netProfitMonthly: number
}

export interface BookmakerDisplay {
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
