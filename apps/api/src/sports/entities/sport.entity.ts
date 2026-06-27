import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity('sports')
export class Sport {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ length: 100 })
  name: string

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string

  @Column({ default: false })
  isEsport: boolean

  @Column({ default: true })
  isActive: boolean
}
