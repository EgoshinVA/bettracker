import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Currency } from './entities/currency.entity'
import { Timezone } from './entities/timezone.entity'
import { Language } from './entities/language.entity'
import { UserPreferences } from './entities/user-preferences.entity'

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Currency) private readonly currencies: Repository<Currency>,
    @InjectRepository(Timezone) private readonly timezones: Repository<Timezone>,
    @InjectRepository(Language) private readonly languages: Repository<Language>,
    @InjectRepository(UserPreferences) private readonly userPrefs: Repository<UserPreferences>,
  ) {}

  getCurrencies(): Promise<Currency[]> {
    return this.currencies.find({ order: { name: 'ASC' } })
  }

  getTimezones(): Promise<Timezone[]> {
    return this.timezones.find({ order: { offset: 'ASC' } })
  }

  getLanguages(): Promise<Language[]> {
    return this.languages.find({ order: { name: 'ASC' } })
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const existing = await this.userPrefs.findOne({
      where: { userId },
      relations: ['currency', 'timezone', 'language'],
    })
    if (existing) return existing

    const [defaultCurrency, defaultTimezone, defaultLanguage] = await Promise.all([
      this.currencies.findOneBy({ code: 'USD' }),
      this.timezones.findOneBy({ code: 'UTC' }),
      this.languages.findOneBy({ code: 'en' }),
    ])

    const created = await this.userPrefs.save(
      this.userPrefs.create({
        userId,
        currencyId: defaultCurrency?.id ?? null,
        timezoneId: defaultTimezone?.id ?? null,
        languageId: defaultLanguage?.id ?? null,
      }),
    )

    return this.userPrefs.findOne({
      where: { id: created.id },
      relations: ['currency', 'timezone', 'language'],
    }) as Promise<UserPreferences>
  }

  async updateCurrency(userId: string, currencyId: string): Promise<UserPreferences> {
    const currency = await this.currencies.findOneBy({ id: currencyId })
    if (!currency) throw new NotFoundException('Currency not found')

    const prefs = await this.getOrCreate(userId)
    prefs.currencyId = currencyId
    await this.userPrefs.save(prefs)
    return this.loadWithRelations(userId)
  }

  async updateTimezone(userId: string, timezoneId: string): Promise<UserPreferences> {
    const timezone = await this.timezones.findOneBy({ id: timezoneId })
    if (!timezone) throw new NotFoundException('Timezone not found')

    const prefs = await this.getOrCreate(userId)
    prefs.timezoneId = timezoneId
    await this.userPrefs.save(prefs)
    return this.loadWithRelations(userId)
  }

  async updateLanguage(userId: string, languageId: string): Promise<UserPreferences> {
    const language = await this.languages.findOneBy({ id: languageId })
    if (!language) throw new NotFoundException('Language not found')

    const prefs = await this.getOrCreate(userId)
    prefs.languageId = languageId
    await this.userPrefs.save(prefs)
    return this.loadWithRelations(userId)
  }

  private async getOrCreate(userId: string): Promise<UserPreferences> {
    let prefs = await this.userPrefs.findOneBy({ userId })
    if (!prefs) {
      prefs = await this.userPrefs.save(this.userPrefs.create({ userId }))
    }
    return prefs
  }

  private loadWithRelations(userId: string): Promise<UserPreferences> {
    return this.userPrefs.findOne({
      where: { userId },
      relations: ['currency', 'timezone', 'language'],
    }) as Promise<UserPreferences>
  }
}
