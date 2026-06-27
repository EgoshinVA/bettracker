import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExchangeRate } from './entities/exchange-rate.entity'

const RATES = [
  { currencyCode: 'USD', usdRate: 1.0 },
  { currencyCode: 'RUB', usdRate: 90.0 },
  { currencyCode: 'EUR', usdRate: 0.93 },
  { currencyCode: 'GBP', usdRate: 0.79 },
]

@Injectable()
export class ExchangeRatesSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly ratesRepo: Repository<ExchangeRate>,
  ) {}

  async onModuleInit() {
    for (const seed of RATES) {
      const existing = await this.ratesRepo.findOneBy({ currencyCode: seed.currencyCode })
      if (!existing) {
        await this.ratesRepo.save(this.ratesRepo.create(seed))
      }
    }
  }
}
