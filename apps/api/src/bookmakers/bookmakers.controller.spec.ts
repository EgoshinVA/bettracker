import { Test, TestingModule } from '@nestjs/testing'
import { BookmakersController } from './bookmakers.controller'
import { BookmakersService } from './bookmakers.service'
import { User } from '../users/entities/user.entity'
import { Bookmaker } from './entities/bookmaker.entity'
import { CreateBookmakerDto } from './dto/create-bookmaker.dto'

const mockUser = { id: 'user-1' } as User

const mockBookmaker: Partial<Bookmaker> = {
  id: 'bk-1',
  name: 'Bet365',
  shortName: 'B365',
  color: '#00A651',
  isActive: true,
}

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getStats: jest.fn(),
}

describe('BookmakersController', () => {
  let controller: BookmakersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmakersController],
      providers: [{ provide: BookmakersService, useValue: mockService }],
    }).compile()

    controller = module.get<BookmakersController>(BookmakersController)
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call service.create and return bookmaker', async () => {
      const dto: CreateBookmakerDto = { name: 'Bet365', shortName: 'B365' }
      mockService.create.mockResolvedValue(mockBookmaker)

      const result = await controller.create(mockUser, dto)

      expect(mockService.create).toHaveBeenCalledWith('user-1', dto)
      expect(result).toEqual(mockBookmaker)
    })
  })

  describe('findAll', () => {
    it('should return all bookmakers for user', async () => {
      mockService.findAll.mockResolvedValue([mockBookmaker])

      const result = await controller.findAll(mockUser)

      expect(mockService.findAll).toHaveBeenCalledWith('user-1')
      expect(result).toEqual([mockBookmaker])
    })
  })

  describe('getStats', () => {
    it('should return stats for user bookmakers', async () => {
      const stats = [{ bookmaker: mockBookmaker, volume: 5000, roi: 12.5, volumePct: 100 }]
      mockService.getStats.mockResolvedValue(stats)

      const result = await controller.getStats(mockUser)

      expect(mockService.getStats).toHaveBeenCalledWith('user-1')
      expect(result).toEqual(stats)
    })
  })

  describe('findOne', () => {
    it('should return a single bookmaker', async () => {
      mockService.findOne.mockResolvedValue(mockBookmaker)

      const result = await controller.findOne(mockUser, 'bk-1')

      expect(mockService.findOne).toHaveBeenCalledWith('user-1', 'bk-1')
      expect(result).toEqual(mockBookmaker)
    })
  })

  describe('update', () => {
    it('should update and return the bookmaker', async () => {
      const updated = { ...mockBookmaker, name: 'Pinnacle' }
      mockService.update.mockResolvedValue(updated)

      const result = await controller.update(mockUser, 'bk-1', { name: 'Pinnacle' })

      expect(mockService.update).toHaveBeenCalledWith('user-1', 'bk-1', { name: 'Pinnacle' })
      expect(result).toEqual(updated)
    })
  })

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockService.remove.mockResolvedValue(undefined)

      await controller.remove(mockUser, 'bk-1')

      expect(mockService.remove).toHaveBeenCalledWith('user-1', 'bk-1')
    })
  })
})
