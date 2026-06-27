import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { Bet } from '../../bets/entities/bet.entity'
import { RefreshToken } from '../../auth/entities/refresh-token.entity'
import { Bookmaker } from '../../bookmakers/entities/bookmaker.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ default: false })
  isEmailVerified: boolean

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.FREE })
  subscriptionStatus: SubscriptionStatus

  @Column({ type: 'timestamptz', nullable: true, default: null })
  subscriptionExpiresAt: Date | null

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[]

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => Bookmaker, (bk) => bk.user)
  bookmakers: Bookmaker[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
