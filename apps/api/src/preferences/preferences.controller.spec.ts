import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { PreferencesController } from './preferences.controller'
import { PreferencesService } from './preferences.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { User } from '../users/entities/user.entity'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'

const mockUser = { id: 'user-1' } as User

const mockCurrency = { id: 'cur-1', code: 'USD', name: 'US Dollar', symbol: '$' }
const mockTimezone = { id: 'tz-1', code: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00' }
const mockLanguage = { id: 'lang-1', code: 'en', name: 'English', nativeName: 'English' }
const mockPrefs = {
  id: 'prefs-1',
  userId: 'user-1',
  currency: mockCurrency,
  currencyId: 'cur-1',
  timezone: mockTimezone,
  timezoneId: 'tz-1',
  language: mockLanguage,
  languageId: 'lang-1',
}

describe('PreferencesController', () => {
  let controller: PreferencesController
  let service: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockService = {
      getCurrencies: jest.fn(),
      getTimezones: jest.fn(),
      getLanguages: jest.fn(),
      getUserPreferences: jest.fn(),
      updateCurrency: jest.fn(),
      updateTimezone: jest.fn(),
      updateLanguage: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferencesController],
      providers: [{ provide: PreferencesService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<PreferencesController>(PreferencesController)
    service = module.get(PreferencesService)
    jest.clearAllMocks()
  })

  describe('getCurrencies', () => {
    it('should return list of currencies', async () => {
      service.getCurrencies.mockResolvedValue([mockCurrency])

      const result = await controller.getCurrencies()

      expect(service.getCurrencies).toHaveBeenCalled()
      expect(result).toEqual([mockCurrency])
    })
  })

  describe('getTimezones', () => {
    it('should return list of timezones', async () => {
      service.getTimezones.mockResolvedValue([mockTimezone])

      const result = await controller.getTimezones()

      expect(result).toEqual([mockTimezone])
    })
  })

  describe('getLanguages', () => {
    it('should return list of languages', async () => {
      service.getLanguages.mockResolvedValue([mockLanguage])

      const result = await controller.getLanguages()

      expect(result).toEqual([mockLanguage])
    })
  })

  describe('getMyPreferences', () => {
    it('should return current user preferences', async () => {
      service.getUserPreferences.mockResolvedValue(mockPrefs)

      const result = await controller.getMyPreferences(mockUser)

      expect(service.getUserPreferences).toHaveBeenCalledWith('user-1')
      expect(result).toEqual(mockPrefs)
    })
  })

  describe('updateCurrency', () => {
    it('should call updateCurrency with userId and currencyId', async () => {
      service.updateCurrency.mockResolvedValue(mockPrefs)

      const result = await controller.updateCurrency(mockUser, { currencyId: 'cur-1' })

      expect(service.updateCurrency).toHaveBeenCalledWith('user-1', 'cur-1')
      expect(result).toEqual(mockPrefs)
    })

    it('should propagate NotFoundException from service', async () => {
      service.updateCurrency.mockRejectedValue(new NotFoundException('Currency not found'))

      await expect(
        controller.updateCurrency(mockUser, { currencyId: 'bad' }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateTimezone', () => {
    it('should call updateTimezone with userId and timezoneId', async () => {
      service.updateTimezone.mockResolvedValue(mockPrefs)

      const result = await controller.updateTimezone(mockUser, { timezoneId: 'tz-1' })

      expect(service.updateTimezone).toHaveBeenCalledWith('user-1', 'tz-1')
      expect(result).toEqual(mockPrefs)
    })

    it('should propagate NotFoundException from service', async () => {
      service.updateTimezone.mockRejectedValue(new NotFoundException('Timezone not found'))

      await expect(
        controller.updateTimezone(mockUser, { timezoneId: 'bad' }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateLanguage', () => {
    it('should call updateLanguage with userId and languageId', async () => {
      service.updateLanguage.mockResolvedValue(mockPrefs)

      const result = await controller.updateLanguage(mockUser, { languageId: 'lang-1' })

      expect(service.updateLanguage).toHaveBeenCalledWith('user-1', 'lang-1')
      expect(result).toEqual(mockPrefs)
    })

    it('should propagate NotFoundException from service', async () => {
      service.updateLanguage.mockRejectedValue(new NotFoundException('Language not found'))

      await expect(
        controller.updateLanguage(mockUser, { languageId: 'bad' }),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
