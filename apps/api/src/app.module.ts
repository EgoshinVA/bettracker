import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BetsModule } from './bets/bets.module'
import { AuthModule } from './auth/auth.module'
import { User } from './users/entities/user.entity'
import { Bet } from './bets/entities/bet.entity'
import { RefreshToken } from './auth/entities/refresh-token.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Bet, RefreshToken],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    BetsModule,
    AuthModule,
  ],
})
export class AppModule {}
