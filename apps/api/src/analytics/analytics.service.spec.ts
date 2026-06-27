import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BetResult, BetType } from '@bettracker/shared'
import { AnalyticsService } from './analytics.service'
import { Bet } from '../bets/entities/bet.entity'
import { Bookmaker } from '../bookmakers/entities/bookmaker.entity'
import { User } from '../users/entities/user.entity'

const mockUser = { id: 'user-1' } as User

const makeBet = (overrides: Partial<Bet> = {}): Bet =>
  ({
    id: 'bet-1',
    sport: 'Football',
    league: 'PL',
    match: 'A vs B',
    odds: 2.0,
    stake: 100,
    betType: BetType.MONEYLINE,
    result: BetResult.PENDING,
    notes: null,
    profit: null,
    bookmaker: null,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Bet

const mockBetsRepo = { find: jest.fn() }
const mockBookmakersRepo = { find: jest.fn() }

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: getRepositoryToken(Bet), useValue: mockBetsRepo },
        { provide: getRepositoryToken(Bookmaker), useValue: mockBookmakersRepo },
      ],
    }).compile()

    service = module.get<AnalyticsService>(AnalyticsService)
    jest.clearAllMocks()
  })

  describe('getOverview', () => {
    it('should return zero values when no bets in period', async () => {
      mockBetsRepo.find.mockResolvedValue([])

      const result = await service.getOverview('user-1', '30D')

      expect(result.totalProfit).toBe(0)
      expect(result.winRate).toBe(0)
      expect(result.roi).toBe(0)
      expect(result.avgOdds).toBe(0)
      expect(result.sportDistribution).toEqual([])
      expect(result.bookmakerYield).toEqual([])
    })

    it('should compute totalProfit and roi from settled bets', async () => {
      const wonBet = makeBet({ result: BetResult.WON, stake: 100, odds: 2.0, profit: 100 })
      const lostBet = makeBet({ id: 'bet-2', result: BetResult.LOST, stake: 100, profit: -100 })
      mockBetsRepo.find.mockResolvedValue([wonBet, lostBet])

      const result = await service.getOverview('user-1', '30D')

      expect(result.totalProfit).toBe(0)
      expect(result.roi).toBe(0)
      expect(result.winRate).toBe(50)
    })

    it('should calculate avgOdds across all bets including pending', async () => {
      const b1 = makeBet({ odds: 2.0 })
      const b2 = makeBet({ id: 'bet-2', odds: 3.0 })
      mockBetsRepo.find.mockResolvedValue([b1, b2])

      const result = await service.getOverview('user-1', '30D')

      expect(result.avgOdds).toBe(2.5)
    })

    it('should build sport distribution sorted by bet count', async () => {
      const footballBet1 = makeBet({ sport: 'Football' })
      const footballBet2 = makeBet({ id: 'b2', sport: 'Football' })
      const basketballBet = makeBet({ id: 'b3', sport: 'Basketball' })
      mockBetsRepo.find.mockResolvedValue([footballBet1, footballBet2, basketballBet])

      const result = await service.getOverview('user-1', '30D')

      expect(result.sportDistribution[0].sport).toBe('Football')
      expect(result.sportDistribution[0].pct).toBe(67)
      expect(result.sportDistribution[1].sport).toBe('Basketball')
      expect(result.sportDistribution[1].pct).toBe(33)
    })

    it('should build bookmaker yield only for bets with bookmaker', async () => {
      const bk = { id: 'bk-1', name: 'Bet365' } as Bookmaker
      const betWithBk = makeBet({ result: BetResult.WON, stake: 200, profit: 100, bookmaker: bk })
      const betNoBk = makeBet({ id: 'bet-2', result: BetResult.WON, stake: 100, profit: 50, bookmaker: null })
      mockBetsRepo.find.mockResolvedValue([betWithBk, betNoBk])

      const result = await service.getOverview('user-1', '30D')

      expect(result.bookmakerYield).toHaveLength(1)
      expect(result.bookmakerYield[0].id).toBe('bk-1')
      expect(result.bookmakerYield[0].volume).toBe(200)
      expect(result.bookmakerYield[0].volumePct).toBe(100)
    })
  })
})
