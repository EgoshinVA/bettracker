import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { BetsModule } from './bets/bets.module'
import { AuthModule } from './auth/auth.module'
import { PreferencesModule } from './preferences/preferences.module'
import { BookmakersModule } from './bookmakers/bookmakers.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { SportsModule } from './sports/sports.module'
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module'
import { HealthModule } from './health/health.module'
import { User } from './users/entities/user.entity'
import { Bet } from './bets/entities/bet.entity'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { Currency } from './preferences/entities/currency.entity'
import { Timezone } from './preferences/entities/timezone.entity'
import { Language } from './preferences/entities/language.entity'
import { UserPreferences } from './preferences/entities/user-preferences.entity'
import { Bookmaker } from './bookmakers/entities/bookmaker.entity'
import { Sport } from './sports/entities/sport.entity'
import { ExchangeRate } from './exchange-rates/entities/exchange-rate.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Bet, RefreshToken, Currency, Timezone, Language, UserPreferences, Bookmaker, Sport, ExchangeRate],
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: config.get<string>('NODE_ENV') === 'production',
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BetsModule,
    AuthModule,
    PreferencesModule,
    BookmakersModule,
    AnalyticsModule,
    SportsModule,
    ExchangeRatesModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
