import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Currency } from './entities/currency.entity'
import { Timezone } from './entities/timezone.entity'
import { Language } from './entities/language.entity'

@Injectable()
export class PreferencesSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Currency) private readonly currencies: Repository<Currency>,
    @InjectRepository(Timezone) private readonly timezones: Repository<Timezone>,
    @InjectRepository(Language) private readonly languages: Repository<Language>,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.seedCurrencies(),
      this.seedTimezones(),
      this.seedLanguages(),
    ])
  }

  private async seedCurrencies() {
    const seeds = [
      { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
    ]
    for (const seed of seeds) {
      const exists = await this.currencies.findOneBy({ code: seed.code })
      if (!exists) await this.currencies.save(this.currencies.create(seed))
    }
  }

  private async seedTimezones() {
    const seeds = [
      { code: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00' },
      { code: 'Europe/Moscow', name: 'Moscow Time', offset: '+03:00' },
      { code: 'Europe/Berlin', name: 'Central European Time', offset: '+01:00' },
      { code: 'America/New_York', name: 'Eastern Time', offset: '-05:00' },
      { code: 'America/Los_Angeles', name: 'Pacific Time', offset: '-08:00' },
      { code: 'Asia/Shanghai', name: 'China Standard Time', offset: '+08:00' },
      { code: 'Asia/Kolkata', name: 'India Standard Time', offset: '+05:30' },
      { code: 'Asia/Tokyo', name: 'Japan Standard Time', offset: '+09:00' },
    ]
    for (const seed of seeds) {
      const exists = await this.timezones.findOneBy({ code: seed.code })
      if (!exists) await this.timezones.save(this.timezones.create(seed))
    }
  }

  private async seedLanguages() {
    const seeds = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
    ]
    for (const seed of seeds) {
      const exists = await this.languages.findOneBy({ code: seed.code })
      if (!exists) await this.languages.save(this.languages.create(seed))
    }
  }
}
