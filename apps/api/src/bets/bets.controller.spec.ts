import { Test, TestingModule } from '@nestjs/testing'
import { BetsController } from './bets.controller'
import { BetsService } from './bets.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { BetResult, BetType } from '@bettracker/shared'
import { User } from '../users/entities/user.entity'
import { Bet } from './entities/bet.entity'

const mockUser = { id: 'user-1' } as User

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
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('BetsController', () => {
  let controller: BetsController
  let service: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockService = {
      createBet: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateResult: jest.fn(),
      remove: jest.fn(),
      getStats: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsController],
      providers: [{ provide: BetsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<BetsController>(BetsController)
    service = module.get(BetsService)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call createBet with user id and dto, and return bet', async () => {
      const dto = {
        sport: 'Football',
        league: 'Premier League',
        match: 'Man City vs Arsenal',
        odds: 1.85,
        stake: 200,
        betType: BetType.MONEYLINE,
      }
      service.createBet.mockResolvedValue(mockBet)

      const result = await controller.create(mockUser, dto)

      expect(service.createBet).toHaveBeenCalledWith('user-1', dto)
      expect(result).toEqual(mockBet)
    })
  })

  describe('findAll', () => {
    it('should call findAll with user id and return bets array', async () => {
      service.findAll.mockResolvedValue([mockBet])

      const result = await controller.findAll(mockUser)

      expect(service.findAll).toHaveBeenCalledWith('user-1')
      expect(result).toEqual([mockBet])
    })
  })

  describe('getStats', () => {
    it('should call getStats with user id and return stats', async () => {
      const stats = { totalBets: 5, settledBets: 4, winRate: 75, roi: 12.5, netProfit: 100 }
      service.getStats.mockResolvedValue(stats)

      const result = await controller.getStats(mockUser)

      expect(service.getStats).toHaveBeenCalledWith('user-1')
      expect(result).toEqual(stats)
    })
  })

  describe('findOne', () => {
    it('should call findOne with user id and bet id, and return bet', async () => {
      service.findOne.mockResolvedValue(mockBet)

      const result = await controller.findOne(mockUser, 'bet-1')

      expect(service.findOne).toHaveBeenCalledWith('user-1', 'bet-1')
      expect(result).toEqual(mockBet)
    })
  })

  describe('updateResult', () => {
    it('should call updateResult with user id, bet id and result from dto', async () => {
      const updatedBet = { ...mockBet, result: BetResult.WON, profit: 170 } as Bet
      service.updateResult.mockResolvedValue(updatedBet)
      const dto = { result: BetResult.WON }

      const result = await controller.updateResult(mockUser, 'bet-1', dto)

      expect(service.updateResult).toHaveBeenCalledWith('user-1', 'bet-1', BetResult.WON)
      expect(result).toEqual(updatedBet)
    })
  })

  describe('remove', () => {
    it('should call remove with user id and bet id', async () => {
      service.remove.mockResolvedValue(undefined)

      await controller.remove(mockUser, 'bet-1')

      expect(service.remove).toHaveBeenCalledWith('user-1', 'bet-1')
    })
  })
})
