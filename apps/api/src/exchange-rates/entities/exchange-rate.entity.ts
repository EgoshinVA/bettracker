import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn } from 'typeorm'

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ length: 10 })
  currencyCode: string

  /** Units of this currency per 1 USD. USD itself = 1.0 */
  @Column('decimal', { precision: 18, scale: 6 })
  usdRate: number

  @UpdateDateColumn()
  updatedAt: Date
}
