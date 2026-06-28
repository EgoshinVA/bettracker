import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { BetResult, BetType } from '@bettracker/shared'
import { BookmakersService } from './bookmakers.service'
import { Bookmaker } from './entities/bookmaker.entity'
import { CreateBookmakerDto } from './dto/create-bookmaker.dto'
import { User } from '../users/entities/user.entity'
import { Bet } from '../bets/entities/bet.entity'

const mockUser = { id: 'user-1' } as User

const mockBet = (overrides: Partial<Bet> = {}): Bet =>
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

const mockBookmaker: Bookmaker = {
  id: 'bk-1',
  name: 'Bet365',
  shortName: 'B365',
  color: '#00A651',
  isActive: true,
  user: mockUser,
  bets: [],
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

describe('BookmakersService', () => {
  let service: BookmakersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmakersService,
        { provide: getRepositoryToken(Bookmaker), useValue: mockRepository },
      ],
    }).compile()

    service = module.get<BookmakersService>(BookmakersService)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create and return a bookmaker', async () => {
      const dto: CreateBookmakerDto = { name: 'Bet365', shortName: 'B365', color: '#00A651' }
      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockBookmaker)
      mockRepository.save.mockResolvedValue(mockBookmaker)

      const result = await service.create('user-1', dto)

      expect(result).toEqual(mockBookmaker)
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: 'Bet365',
        shortName: 'B365',
        color: '#00A651',
        user: { id: 'user-1' },
      })
    })

    it('should throw ConflictException when bookmaker name already exists for user', async () => {
      mockRepository.findOne.mockResolvedValue(mockBookmaker)

      await expect(
        service.create('user-1', { name: 'Bet365', shortName: 'B365' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findAll', () => {
    it('should return all bookmakers for user ordered by name', async () => {
      mockRepository.find.mockResolvedValue([mockBookmaker])

      const result = await service.findAll('user-1')

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
        order: { name: 'ASC' },
      })
      expect(result).toEqual([mockBookmaker])
    })
  })

  describe('findOne', () => {
    it('should return bookmaker when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockBookmaker)
      const result = await service.findOne('user-1', 'bk-1')
      expect(result).toEqual(mockBookmaker)
    })

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)
      await expect(service.findOne('user-1', 'unknown')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update and return bookmaker', async () => {
      const updated = { ...mockBookmaker, name: 'Pinnacle' }
      mockRepository.findOne.mockResolvedValue({ ...mockBookmaker })
      mockRepository.save.mockResolvedValue(updated)

      const result = await service.update('user-1', 'bk-1', { name: 'Pinnacle' })

      expect(result.name).toBe('Pinnacle')
    })
  })

  describe('remove', () => {
    it('should find and remove bookmaker', async () => {
      mockRepository.findOne.mockResolvedValue(mockBookmaker)
      mockRepository.remove.mockResolvedValue(undefined)

      await service.remove('user-1', 'bk-1')

      expect(mockRepository.remove).toHaveBeenCalledWith(mockBookmaker)
    })

    it('should throw NotFoundException when bookmaker not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)
      await expect(service.remove('user-1', 'unknown')).rejects.toThrow(NotFoundException)
    })
  })

  describe('getStats', () => {
    it('should return empty stats list when no bookmakers', async () => {
      mockRepository.find.mockResolvedValue([])
      const result = await service.getStats('user-1')
      expect(result).toEqual([])
    })

    it('should compute volume, roi, winRate per bookmaker from settled bets', async () => {
      const wonBet = mockBet({ result: BetResult.WON, stake: 100, odds: 2.0, profit: 100 })
      const lostBet = mockBet({ id: 'bet-2', result: BetResult.LOST, stake: 100, odds: 1.5, profit: -100 })
      const bkWithBets = { ...mockBookmaker, bets: [wonBet, lostBet] }
      mockRepository.find.mockResolvedValue([bkWithBets])

      const result = await service.getStats('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].volume).toBe(200)
      expect(result[0].profit).toBe(0)
      expect(result[0].roi).toBe(0)
      expect(result[0].winRate).toBe(50)
      expect(result[0].volumePct).toBe(100)
    })

    it('should calculate ROI only on settled bet stakes, excluding pending', async () => {
      // 1 won bet + 1 pending — ROI must be based on settled stake only
      const wonBet = mockBet({ stake: 100, result: BetResult.WON, profit: 100 })
      const pendingBet = mockBet({ id: 'bet-2', stake: 100, result: BetResult.PENDING, profit: null })
      const bkWithBets = { ...mockBookmaker, bets: [wonBet, pendingBet] }
      mockRepository.find.mockResolvedValue([bkWithBets])

      const result = await service.getStats('user-1')

      // volume = total wagered (display purposes, includes pending)
      expect(result[0].volume).toBe(200)
      // ROI = profit / settledStake = 100 / 100 = 100%, NOT 50%
      expect(result[0].roi).toBe(100)
      // winRate counts settled only: 1/1 = 100%
      expect(result[0].winRate).toBe(100)
    })

    it('should return 0 ROI and 0 winRate when all bets are pending', async () => {
      const pendingBet = mockBet({ stake: 200, result: BetResult.PENDING, profit: null })
      const bkWithBets = { ...mockBookmaker, bets: [pendingBet] }
      mockRepository.find.mockResolvedValue([bkWithBets])

      const result = await service.getStats('user-1')

      expect(result[0].roi).toBe(0)
      expect(result[0].winRate).toBe(0)
      expect(result[0].volume).toBe(200)
      expect(result[0].totalBets).toBe(1)
    })

    it('should calculate volumePct relative to total across bookmakers', async () => {
      const bk1 = { ...mockBookmaker, id: 'bk-1', bets: [mockBet({ stake: 300, result: BetResult.WON, profit: 300 })] }
      const bk2 = { ...mockBookmaker, id: 'bk-2', bets: [mockBet({ stake: 100, result: BetResult.WON, profit: 100 })] }
      mockRepository.find.mockResolvedValue([bk1, bk2])

      const result = await service.getStats('user-1')

      expect(result[0].volumePct).toBe(75)
      expect(result[1].volumePct).toBe(25)
    })

    it('should include pending bets in totalBets count but not in winRate', async () => {
      const wonBet = mockBet({ stake: 50, result: BetResult.WON, profit: 50 })
      const lostBet = mockBet({ id: 'bet-2', stake: 50, result: BetResult.LOST, profit: -50 })
      const pendingBet = mockBet({ id: 'bet-3', stake: 50, result: BetResult.PENDING, profit: null })
      const bkWithBets = { ...mockBookmaker, bets: [wonBet, lostBet, pendingBet] }
      mockRepository.find.mockResolvedValue([bkWithBets])

      const result = await service.getStats('user-1')

      expect(result[0].totalBets).toBe(3)
      // winRate only on settled (2 settled: 1 won) = 50%
      expect(result[0].winRate).toBe(50)
      // ROI on settled stake 100: profit 0 = 0%
      expect(result[0].roi).toBe(0)
    })
  })
})
