import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Stored as bcrypt hash — never the raw token */
  @Index()
  @Column({ unique: true })
  token: string

  /** Denormalized FK for fast lookup without JOIN */
  @Index()
  @Column()
  userId: string

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ type: 'timestamptz' })
  expiresAt: Date

  @Column({ default: false })
  isRevoked: boolean

  @CreateDateColumn()
  createdAt: Date
}
