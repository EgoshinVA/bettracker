import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BetResult, BetType } from '@bettracker/shared'
import { User } from '../../users/entities/user.entity'
import { Bookmaker } from '../../bookmakers/entities/bookmaker.entity'

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

  @Index()
  @ManyToOne(() => User, (user) => user.bets, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Bookmaker, (bk) => bk.bets, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bookmaker_id' })
  bookmaker: Bookmaker | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
