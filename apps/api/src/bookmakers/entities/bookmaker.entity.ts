import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Bet } from '../../bets/entities/bet.entity'

@Entity('bookmakers')
export class Bookmaker {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 10 })
  shortName: string

  @Column({ length: 7, default: '#7c3aed' })
  color: string

  @Column({ default: true })
  isActive: boolean

  @Index()
  @ManyToOne(() => User, (user) => user.bookmakers, { onDelete: 'CASCADE' })
  user: User

  @OneToMany(() => Bet, (bet) => bet.bookmaker)
  bets: Bet[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
