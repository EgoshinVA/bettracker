import { Test, TestingModule } from '@nestjs/testing'
import { SportsController } from './sports.controller'
import { SportsService } from './sports.service'
import { Sport } from './entities/sport.entity'

const mockSports: Sport[] = [
  { id: '1', name: 'Football', slug: 'football', isEsport: false, isActive: true },
  { id: '2', name: 'CS2', slug: 'cs2', isEsport: true, isActive: true },
]

const mockService = { findAll: jest.fn() }

describe('SportsController', () => {
  let controller: SportsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [{ provide: SportsService, useValue: mockService }],
    }).compile()

    controller = module.get<SportsController>(SportsController)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return all active sports', async () => {
      mockService.findAll.mockResolvedValue(mockSports)

      const result = await controller.findAll()

      expect(mockService.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockSports)
    })
  })
})
