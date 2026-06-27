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
import { Currency } from './currency.entity'
import { Timezone } from './timezone.entity'
import { Language } from './language.entity'

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column()
  userId: string

  @ManyToOne(() => Currency, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency | null

  @Column({ nullable: true, type: 'uuid' })
  currencyId: string | null

  @ManyToOne(() => Timezone, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'timezoneId' })
  timezone: Timezone | null

  @Column({ nullable: true, type: 'uuid' })
  timezoneId: string | null

  @ManyToOne(() => Language, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'languageId' })
  language: Language | null

  @Column({ nullable: true, type: 'uuid' })
  languageId: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
