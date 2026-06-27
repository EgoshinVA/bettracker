import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'
import { Bet } from '../bets/entities/bet.entity'
import { Bookmaker } from '../bookmakers/entities/bookmaker.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Bet, Bookmaker])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
