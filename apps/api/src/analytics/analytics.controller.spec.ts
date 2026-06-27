import { Test, TestingModule } from '@nestjs/testing'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsService } from './analytics.service'
import { User } from '../users/entities/user.entity'

const mockUser = { id: 'user-1' } as User

const mockOverview = {
  totalProfit: 1250,
  winRate: 58.4,
  roi: 14.2,
  avgOdds: 2.1,
  profitOverTime: [],
  sportDistribution: [],
  bookmakerYield: [],
}

const mockService = { getOverview: jest.fn() }

describe('AnalyticsController', () => {
  let controller: AnalyticsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockService }],
    }).compile()

    controller = module.get<AnalyticsController>(AnalyticsController)
    jest.clearAllMocks()
  })

  describe('getOverview', () => {
    it('should call service.getOverview with default period', async () => {
      mockService.getOverview.mockResolvedValue(mockOverview)

      const result = await controller.getOverview(mockUser, undefined)

      expect(mockService.getOverview).toHaveBeenCalledWith('user-1', undefined)
      expect(result).toEqual(mockOverview)
    })

    it('should pass period query param to service', async () => {
      mockService.getOverview.mockResolvedValue(mockOverview)

      await controller.getOverview(mockUser, '7D')

      expect(mockService.getOverview).toHaveBeenCalledWith('user-1', '7D')
    })
  })
})
