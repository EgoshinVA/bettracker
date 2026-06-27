import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExchangeRatesService } from './exchange-rates.service'
import { ExchangeRatesController } from './exchange-rates.controller'
import { ExchangeRatesSeeder } from './exchange-rates.seeder'
import { ExchangeRate } from './entities/exchange-rate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService, ExchangeRatesSeeder],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
