import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { ExchangeRatesService } from './exchange-rates.service'
import { ExchangeRate } from './entities/exchange-rate.entity'

const mockRates: ExchangeRate[] = [
  { id: '1', currencyCode: 'EUR', usdRate: 0.93, updatedAt: new Date() },
  { id: '2', currencyCode: 'GBP', usdRate: 0.79, updatedAt: new Date() },
  { id: '3', currencyCode: 'RUB', usdRate: 90.0, updatedAt: new Date() },
  { id: '4', currencyCode: 'USD', usdRate: 1.0, updatedAt: new Date() },
]

const mockRepo = { find: jest.fn(), findOneBy: jest.fn() }

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        { provide: getRepositoryToken(ExchangeRate), useValue: mockRepo },
      ],
    }).compile()

    service = module.get<ExchangeRatesService>(ExchangeRatesService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return all exchange rates ordered by code', async () => {
      mockRepo.find.mockResolvedValue(mockRates)

      const result = await service.findAll()

      expect(mockRepo.find).toHaveBeenCalledWith({ order: { currencyCode: 'ASC' } })
      expect(result).toHaveLength(4)
    })
  })

  describe('findByCode', () => {
    it('should return rate for known currency code', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockRates[2])

      const result = await service.findByCode('RUB')

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ currencyCode: 'RUB' })
      expect(result.usdRate).toBe(90.0)
    })

    it('should be case-insensitive — uppercase the code', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockRates[3])

      await service.findByCode('usd')

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ currencyCode: 'USD' })
    })

    it('should throw NotFoundException for unknown currency', async () => {
      mockRepo.findOneBy.mockResolvedValue(null)

      await expect(service.findByCode('XYZ')).rejects.toThrow(NotFoundException)
    })
  })
})
