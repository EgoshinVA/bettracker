import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { BetsService } from './bets.service'
import { Bet, BetResult, BetType } from './entities/bet.entity'
import { CreateBetDto } from './dto/create-bet.dto'

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
  user: { id: 'user-1' } as any,
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
      mockRepository.save.mockImplementation((b) => Promise.resolve(b))

      const result = await service.updateResult('user-1', 'bet-1', BetResult.WON)

      expect(result.result).toBe(BetResult.WON)
      expect(result.profit).toBe(170) // (200 * 1.85) - 200
    })

    it('should set negative profit on LOST', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockBet })
      mockRepository.save.mockImplementation((b) => Promise.resolve(b))

      const result = await service.updateResult('user-1', 'bet-1', BetResult.LOST)

      expect(result.result).toBe(BetResult.LOST)
      expect(result.profit).toBe(-200)
    })
  })
})
