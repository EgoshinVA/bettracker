import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BetsModule } from './bets/bets.module'
import { AuthModule } from './auth/auth.module'
import { PreferencesModule } from './preferences/preferences.module'
import { User } from './users/entities/user.entity'
import { Bet } from './bets/entities/bet.entity'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { Currency } from './preferences/entities/currency.entity'
import { Timezone } from './preferences/entities/timezone.entity'
import { Language } from './preferences/entities/language.entity'
import { UserPreferences } from './preferences/entities/user-preferences.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Bet, RefreshToken, Currency, Timezone, Language, UserPreferences],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    BetsModule,
    AuthModule,
    PreferencesModule,
  ],
})
export class AppModule {}
