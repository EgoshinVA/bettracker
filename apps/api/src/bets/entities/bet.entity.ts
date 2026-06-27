import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum BetResult {
  WON = 'WON',
  LOST = 'LOST',
  PENDING = 'PENDING',
}

export enum BetType {
  MONEYLINE = 'moneyline',
  SPREAD = 'spread',
  OVER_UNDER = 'over_under',
  PARLAY = 'parlay',
  BTTS = 'btts',
}

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  sport: string

  @Column()
  league: string

  @Column()
  match: string

  @Column('decimal', { precision: 10, scale: 2 })
  odds: number

  @Column('decimal', { precision: 10, scale: 2 })
  stake: number

  @Column({ type: 'enum', enum: BetType })
  betType: BetType

  @Column({ type: 'enum', enum: BetResult, default: BetResult.PENDING })
  result: BetResult

  @Column({ nullable: true, type: 'text' })
  notes: string | null

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  profit: number | null

  @ManyToOne(() => User, (user) => user.bets, { onDelete: 'CASCADE' })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
