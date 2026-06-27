import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { BetResult, BetType } from '@bettracker/shared'
import { BetsService } from './bets.service'
import { Bet } from './entities/bet.entity'
import { CreateBetDto } from './dto/create-bet.dto'
import { User } from '../users/entities/user.entity'

const mockBet: Bet = {
  id: 'bet-1',
  sport: 'Football',
  league: 'Premier League',
  match: 'Man City vs Arsenal',
  odds: 1.85,
  stake: 200,
  betType: BetType.MONEYLINE,
  result: BetResult.PENDING,
  notes: null,
  profit: null,
  bookmaker: null,
  user: { id: 'user-1' } as unknown as User,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
}

describe('BetsService', () => {
  let service: BetsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        { provide: getRepositoryToken(Bet), useValue: mockRepository },
      ],
    }).compile()

    service = module.get<BetsService>(BetsService)
    jest.clearAllMocks()
  })

  describe('createBet', () => {
    it('should create and return a bet', async () => {
      const dto: CreateBetDto = {
        sport: 'Football',
        league: 'Premier League',
        match: 'Man City vs Arsenal',
        odds: 1.85,
        stake: 200,
        betType: BetType.MONEYLINE,
      }
      mockRepository.create.mockReturnValue(mockBet)
      mockRepository.save.mockResolvedValue(mockBet)

      const result = await service.createBet('user-1', dto)

      expect(result).toMatchObject({ sport: 'Football', odds: 1.85 })
      expect(result.id).toBeDefined()
    })
  })

  describe('findOne', () => {
    it('should return bet when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockBet)
      const result = await service.findOne('user-1', 'bet-1')
      expect(result).toEqual(mockBet)
    })

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)
      await expect(service.findOne('user-1', 'unknown')).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateResult', () => {
    it('should calculate profit on WON', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockBet })
      mockRepository.save.mockImplementation((b: Bet) => Promise.resolve(b))

      const result = await service.updateResult('user-1', 'bet-1', BetResult.WON)

      expect(result.result).toBe(BetResult.WON)
      expect(result.profit).toBe(170) // (200 * 1.85) - 200
    })

    it('should set negative profit on LOST', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockBet })
      mockRepository.save.mockImplementation((b: Bet) => Promise.resolve(b))

      const result = await service.updateResult('user-1', 'bet-1', BetResult.LOST)

      expect(result.result).toBe(BetResult.LOST)
      expect(result.profit).toBe(-200)
    })
  })

  describe('findAll', () => {
    it('should return all bets for user ordered by date', async () => {
      mockRepository.find.mockResolvedValue([mockBet])

      const result = await service.findAll('user-1')

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
        order: { createdAt: 'DESC' },
      })
      expect(result).toEqual([mockBet])
    })
  })

  describe('remove', () => {
    it('should find and remove a bet', async () => {
      mockRepository.findOne.mockResolvedValue(mockBet)
      mockRepository.remove.mockResolvedValue(undefined)

      await service.remove('user-1', 'bet-1')

      expect(mockRepository.remove).toHaveBeenCalledWith(mockBet)
    })

    it('should throw NotFoundException when bet not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      await expect(service.remove('user-1', 'unknown')).rejects.toThrow(NotFoundException)
    })
  })

  describe('getStats', () => {
    it('should return zeroed stats when no bets exist', async () => {
      mockRepository.find.mockResolvedValue([])

      const stats = await service.getStats('user-1')

      expect(stats).toMatchObject({ totalBets: 0, settledBets: 0, winRate: 0, roi: 0, netProfit: 0, roiDelta: 0, netProfitMonthly: 0 })
    })

    it('should return zero winRate and roi when all bets are pending', async () => {
      mockRepository.find.mockResolvedValue([mockBet])

      const stats = await service.getStats('user-1')

      expect(stats.totalBets).toBe(1)
      expect(stats.settledBets).toBe(0)
      expect(stats.winRate).toBe(0)
      expect(stats.roi).toBe(0)
    })

    it('should calculate correct stats from mixed settled bets', async () => {
      const wonBet: Bet = { ...mockBet, id: 'b1', result: BetResult.WON, stake: 100, odds: 2.0, profit: 100 }
      const lostBet: Bet = { ...mockBet, id: 'b2', result: BetResult.LOST, stake: 100, odds: 1.5, profit: -100 }
      const pendingBet: Bet = { ...mockBet, id: 'b3', result: BetResult.PENDING }
      mockRepository.find.mockResolvedValue([wonBet, lostBet, pendingBet])

      const stats = await service.getStats('user-1')

      expect(stats.totalBets).toBe(3)
      expect(stats.settledBets).toBe(2)
      expect(stats.winRate).toBe(50)
      expect(stats.roi).toBe(0)
      expect(stats.netProfit).toBe(0)
    })
  })
})
