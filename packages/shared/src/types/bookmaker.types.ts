export interface Bookmaker {
  id: string
  name: string
  shortName: string
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBookmakerRequest {
  name: string
  shortName: string
  color?: string
}

export interface UpdateBookmakerRequest {
  name?: string
  shortName?: string
  color?: string
  isActive?: boolean
}

export interface BookmakerStats {
  bookmaker: Bookmaker
  totalBets: number
  volume: number
  profit: number
  roi: number
  winRate: number
  volumePct: number
}
