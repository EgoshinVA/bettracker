import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'

config({ path: resolve(__dirname, '../../.env') })
import { User } from '../users/entities/user.entity'
import { Bet } from '../bets/entities/bet.entity'
import { RefreshToken } from '../auth/entities/refresh-token.entity'
import { Currency } from '../preferences/entities/currency.entity'
import { Timezone } from '../preferences/entities/timezone.entity'
import { Language } from '../preferences/entities/language.entity'
import { UserPreferences } from '../preferences/entities/user-preferences.entity'
import { Bookmaker } from '../bookmakers/entities/bookmaker.entity'
import { Sport } from '../sports/entities/sport.entity'
import { ExchangeRate } from '../exchange-rates/entities/exchange-rate.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Bet, RefreshToken, Currency, Timezone, Language, UserPreferences, Bookmaker, Sport, ExchangeRate],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
})
