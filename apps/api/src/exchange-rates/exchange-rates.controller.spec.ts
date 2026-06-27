import { Test, TestingModule } from '@nestjs/testing'
import { ExchangeRatesController } from './exchange-rates.controller'
import { ExchangeRatesService } from './exchange-rates.service'
import { ExchangeRate } from './entities/exchange-rate.entity'

const mockRates: ExchangeRate[] = [
  { id: '1', currencyCode: 'RUB', usdRate: 90.0, updatedAt: new Date() },
  { id: '2', currencyCode: 'USD', usdRate: 1.0, updatedAt: new Date() },
]

const mockService = { findAll: jest.fn(), findByCode: jest.fn() }

describe('ExchangeRatesController', () => {
  let controller: ExchangeRatesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRatesController],
      providers: [{ provide: ExchangeRatesService, useValue: mockService }],
    }).compile()

    controller = module.get<ExchangeRatesController>(ExchangeRatesController)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return all rates', async () => {
      mockService.findAll.mockResolvedValue(mockRates)

      const result = await controller.findAll()

      expect(mockService.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockRates)
    })
  })

  describe('findOne', () => {
    it('should return rate for given currency code', async () => {
      mockService.findByCode.mockResolvedValue(mockRates[0])

      const result = await controller.findOne('RUB')

      expect(mockService.findByCode).toHaveBeenCalledWith('RUB')
      expect(result.usdRate).toBe(90.0)
    })
  })
})
