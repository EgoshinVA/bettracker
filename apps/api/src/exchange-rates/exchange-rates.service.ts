import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExchangeRate } from './entities/exchange-rate.entity'

@Injectable()
export class ExchangeRatesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly ratesRepo: Repository<ExchangeRate>,
  ) {}

  findAll(): Promise<ExchangeRate[]> {
    return this.ratesRepo.find({ order: { currencyCode: 'ASC' } })
  }

  async findByCode(currencyCode: string): Promise<ExchangeRate> {
    const rate = await this.ratesRepo.findOneBy({ currencyCode: currencyCode.toUpperCase() })
    if (!rate) throw new NotFoundException(`Exchange rate for ${currencyCode} not found`)
    return rate
  }
}
