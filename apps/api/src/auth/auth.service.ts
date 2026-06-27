import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'
import type { AuthResponse, AuthTokens, User as SharedUser } from '@bettracker/shared'
import { UsersService } from '../users/users.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from '../users/entities/user.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

// Cost factor 12 ≈ 200–300 ms on modern hardware — acceptable for auth endpoints.
// Increase to 13–14 only if brute-force resistance matters more than latency.
const BCRYPT_ROUNDS = 12
const REFRESH_TTL_DAYS = 7

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
    const user = await this.usersService.create({ email: dto.email, name: dto.name, password: hashed })

    const tokens = await this.issueTokenPair(user)
    return { ...tokens, user: this.toPublicUser(user) }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email, true)
    // Same error for "not found" and "wrong password" — prevents user enumeration
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.issueTokenPair(user)
    return { ...tokens, user: this.toPublicUser(user) }
  }

  async refresh(rawToken: string): Promise<AuthTokens> {
    const hash = this.hashToken(rawToken)

    const stored = await this.refreshTokens.findOne({
      where: { token: hash, isRevoked: false },
      relations: ['user'],
    })

    if (!stored || stored.expiresAt < new Date()) {
      // Revoke on reuse or expiry — detect token theft via reuse detection
      if (stored) await this.refreshTokens.update(stored.id, { isRevoked: true })
      throw new UnauthorizedException('Refresh token is invalid or expired')
    }

    // Rotation: revoke current token, issue new pair
    await this.refreshTokens.update(stored.id, { isRevoked: true })
    return this.issueTokenPair(stored.user)
  }

  async logout(rawToken: string): Promise<void> {
    const hash = this.hashToken(rawToken)
    await this.refreshTokens.update({ token: hash }, { isRevoked: true })
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokens.update({ userId, isRevoked: false }, { isRevoked: true })
  }

  private async issueTokenPair(user: User): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email })

    const rawRefreshToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS)

    await this.refreshTokens.save(
      this.refreshTokens.create({
        token: this.hashToken(rawRefreshToken),
        userId: user.id,
        user,
        expiresAt,
      }),
    )

    return { accessToken, refreshToken: rawRefreshToken }
  }

  // SHA-256 for token storage: deterministic (indexable) + high-entropy input makes salting unnecessary
  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex')
  }

  private toPublicUser(user: User): SharedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }
}
