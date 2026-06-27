import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { PreferencesService } from './preferences.service'
import { Currency } from './entities/currency.entity'
import { Timezone } from './entities/timezone.entity'
import { Language } from './entities/language.entity'
import { UserPreferences } from './entities/user-preferences.entity'

const mockCurrency: Currency = { id: 'cur-1', code: 'USD', name: 'US Dollar', symbol: '$' }
const mockTimezone: Timezone = { id: 'tz-1', code: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00' }
const mockLanguage: Language = { id: 'lang-1', code: 'en', name: 'English', nativeName: 'English' }
const mockPrefs: UserPreferences = {
  id: 'prefs-1',
  userId: 'user-1',
  currency: mockCurrency,
  currencyId: 'cur-1',
  timezone: mockTimezone,
  timezoneId: 'tz-1',
  language: mockLanguage,
  languageId: 'lang-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('PreferencesService', () => {
  let service: PreferencesService
  let currencyRepo: Record<string, jest.Mock>
  let timezoneRepo: Record<string, jest.Mock>
  let languageRepo: Record<string, jest.Mock>
  let prefsRepo: Record<string, jest.Mock>

  beforeEach(async () => {
    currencyRepo = { find: jest.fn(), findOneBy: jest.fn() }
    timezoneRepo = { find: jest.fn(), findOneBy: jest.fn() }
    languageRepo = { find: jest.fn(), findOneBy: jest.fn() }
    prefsRepo = { findOne: jest.fn(), findOneBy: jest.fn(), create: jest.fn(), save: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        { provide: getRepositoryToken(Currency), useValue: currencyRepo },
        { provide: getRepositoryToken(Timezone), useValue: timezoneRepo },
        { provide: getRepositoryToken(Language), useValue: languageRepo },
        { provide: getRepositoryToken(UserPreferences), useValue: prefsRepo },
      ],
    }).compile()

    service = module.get<PreferencesService>(PreferencesService)
    jest.clearAllMocks()
  })

  describe('getCurrencies', () => {
    it('should return all currencies ordered by name', async () => {
      currencyRepo.find.mockResolvedValue([mockCurrency])

      const result = await service.getCurrencies()

      expect(currencyRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } })
      expect(result).toEqual([mockCurrency])
    })
  })

  describe('getTimezones', () => {
    it('should return all timezones ordered by offset', async () => {
      timezoneRepo.find.mockResolvedValue([mockTimezone])

      const result = await service.getTimezones()

      expect(timezoneRepo.find).toHaveBeenCalledWith({ order: { offset: 'ASC' } })
      expect(result).toEqual([mockTimezone])
    })
  })

  describe('getLanguages', () => {
    it('should return all languages ordered by name', async () => {
      languageRepo.find.mockResolvedValue([mockLanguage])

      const result = await service.getLanguages()

      expect(languageRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } })
      expect(result).toEqual([mockLanguage])
    })
  })

  describe('getUserPreferences', () => {
    it('should return existing preferences with relations', async () => {
      prefsRepo.findOne.mockResolvedValue(mockPrefs)

      const result = await service.getUserPreferences('user-1')

      expect(prefsRepo.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['currency', 'timezone', 'language'],
      })
      expect(result).toEqual(mockPrefs)
    })

    it('should create default preferences when none exist', async () => {
      prefsRepo.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockPrefs)
      currencyRepo.findOneBy.mockResolvedValue(mockCurrency)
      timezoneRepo.findOneBy.mockResolvedValue(mockTimezone)
      languageRepo.findOneBy.mockResolvedValue(mockLanguage)
      prefsRepo.create.mockReturnValue({ userId: 'user-1', currencyId: 'cur-1', timezoneId: 'tz-1', languageId: 'lang-1' })
      prefsRepo.save.mockResolvedValue({ id: 'prefs-1', userId: 'user-1' })

      const result = await service.getUserPreferences('user-1')

      expect(prefsRepo.save).toHaveBeenCalled()
      expect(result).toEqual(mockPrefs)
    })
  })

  describe('updateCurrency', () => {
    it('should update currency and return preferences with relations', async () => {
      currencyRepo.findOneBy.mockResolvedValue(mockCurrency)
      prefsRepo.findOneBy.mockResolvedValue({ ...mockPrefs, currencyId: 'old' })
      prefsRepo.save.mockResolvedValue(mockPrefs)
      prefsRepo.findOne.mockResolvedValue(mockPrefs)

      const result = await service.updateCurrency('user-1', 'cur-1')

      expect(currencyRepo.findOneBy).toHaveBeenCalledWith({ id: 'cur-1' })
      expect(prefsRepo.save).toHaveBeenCalledWith(expect.objectContaining({ currencyId: 'cur-1' }))
      expect(result).toEqual(mockPrefs)
    })

    it('should create preferences if they do not exist yet', async () => {
      currencyRepo.findOneBy.mockResolvedValue(mockCurrency)
      prefsRepo.findOneBy.mockResolvedValue(null)
      prefsRepo.create.mockReturnValue({ userId: 'user-1' })
      prefsRepo.save.mockResolvedValue(mockPrefs)
      prefsRepo.findOne.mockResolvedValue(mockPrefs)

      await service.updateCurrency('user-1', 'cur-1')

      expect(prefsRepo.create).toHaveBeenCalledWith({ userId: 'user-1' })
    })

    it('should throw NotFoundException when currency does not exist', async () => {
      currencyRepo.findOneBy.mockResolvedValue(null)

      await expect(service.updateCurrency('user-1', 'bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateTimezone', () => {
    it('should update timezone and return preferences with relations', async () => {
      timezoneRepo.findOneBy.mockResolvedValue(mockTimezone)
      prefsRepo.findOneBy.mockResolvedValue({ ...mockPrefs })
      prefsRepo.save.mockResolvedValue(mockPrefs)
      prefsRepo.findOne.mockResolvedValue(mockPrefs)

      const result = await service.updateTimezone('user-1', 'tz-1')

      expect(prefsRepo.save).toHaveBeenCalledWith(expect.objectContaining({ timezoneId: 'tz-1' }))
      expect(result).toEqual(mockPrefs)
    })

    it('should throw NotFoundException when timezone does not exist', async () => {
      timezoneRepo.findOneBy.mockResolvedValue(null)

      await expect(service.updateTimezone('user-1', 'bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateLanguage', () => {
    it('should update language and return preferences with relations', async () => {
      languageRepo.findOneBy.mockResolvedValue(mockLanguage)
      prefsRepo.findOneBy.mockResolvedValue({ ...mockPrefs })
      prefsRepo.save.mockResolvedValue(mockPrefs)
      prefsRepo.findOne.mockResolvedValue(mockPrefs)

      const result = await service.updateLanguage('user-1', 'lang-1')

      expect(prefsRepo.save).toHaveBeenCalledWith(expect.objectContaining({ languageId: 'lang-1' }))
      expect(result).toEqual(mockPrefs)
    })

    it('should throw NotFoundException when language does not exist', async () => {
      languageRepo.findOneBy.mockResolvedValue(null)

      await expect(service.updateLanguage('user-1', 'bad-id')).rejects.toThrow(NotFoundException)
    })
  })
})
