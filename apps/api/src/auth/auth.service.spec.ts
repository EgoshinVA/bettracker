import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from '../users/entities/user.entity'

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  role: UserRole.USER,
  isEmailVerified: false,
  subscriptionStatus: SubscriptionStatus.FREE,
  subscriptionExpiresAt: null,
  bets: [],
  refreshTokens: [],
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
}

const mockStoredToken: RefreshToken = {
  id: 'token-1',
  token: 'hashed-token',
  userId: 'user-1',
  user: mockUser,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  isRevoked: false,
  createdAt: new Date(),
}

describe('AuthService', () => {
  let service: AuthService
  let usersService: Record<string, jest.Mock>
  let jwtService: Record<string, jest.Mock>
  let refreshTokenRepo: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    }

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('access-token'),
    }

    const mockRefreshTokenRepo = {
      create: jest.fn().mockReturnValue(mockStoredToken),
      save: jest.fn().mockResolvedValue(mockStoredToken),
      findOne: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(RefreshToken), useValue: mockRefreshTokenRepo },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get(UsersService)
    jwtService = module.get(JwtService)
    refreshTokenRepo = module.get(getRepositoryToken(RefreshToken))
    jest.clearAllMocks()
    jwtService.sign.mockReturnValue('access-token')
    refreshTokenRepo.create.mockReturnValue(mockStoredToken)
    refreshTokenRepo.save.mockResolvedValue(mockStoredToken)
    refreshTokenRepo.update.mockResolvedValue(undefined)
  })

  describe('register', () => {
    const dto = { email: 'test@example.com', name: 'Test User', password: 'password123' }

    it('should register a new user and return auth response with tokens and user', async () => {
      usersService.findByEmail.mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never)
      usersService.create.mockResolvedValue(mockUser)

      const result = await service.register(dto)

      expect(result).toHaveProperty('accessToken', 'access-token')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.id).toBe('user-1')
    })

    it('should hash password before creating user', async () => {
      usersService.findByEmail.mockResolvedValue(null)
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never)
      usersService.create.mockResolvedValue(mockUser)

      await service.register(dto)

      expect(hashSpy).toHaveBeenCalledWith('password123', 12)
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed-password' }),
      )
    })

    it('should throw ConflictException when email already in use', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser)

      await expect(service.register(dto)).rejects.toThrow(ConflictException)
      expect(usersService.create).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    const dto = { email: 'test@example.com', password: 'password123' }

    it('should return auth response on valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

      const result = await service.login(dto)

      expect(result).toHaveProperty('accessToken', 'access-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refresh', () => {
    it('should revoke old token and return new tokens when valid', async () => {
      refreshTokenRepo.findOne.mockResolvedValue({ ...mockStoredToken })

      const result = await service.refresh('raw-refresh-token')

      expect(refreshTokenRepo.update).toHaveBeenCalledWith(mockStoredToken.id, { isRevoked: true })
      expect(result).toHaveProperty('accessToken', 'access-token')
      expect(result).toHaveProperty('refreshToken')
    })

    it('should throw UnauthorizedException when token not found', async () => {
      refreshTokenRepo.findOne.mockResolvedValue(null)

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException and revoke when token is expired', async () => {
      const expiredToken = { ...mockStoredToken, expiresAt: new Date('2020-01-01') }
      refreshTokenRepo.findOne.mockResolvedValue(expiredToken)

      await expect(service.refresh('expired-token')).rejects.toThrow(UnauthorizedException)
      expect(refreshTokenRepo.update).toHaveBeenCalledWith(expiredToken.id, { isRevoked: true })
    })
  })

  describe('logout', () => {
    it('should revoke the refresh token by its hash', async () => {
      await service.logout('raw-refresh-token')

      expect(refreshTokenRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ token: expect.any(String) }),
        { isRevoked: true },
      )
    })
  })

  describe('revokeAllUserTokens', () => {
    it('should revoke all active tokens for a user', async () => {
      await service.revokeAllUserTokens('user-1')

      expect(refreshTokenRepo.update).toHaveBeenCalledWith(
        { userId: 'user-1', isRevoked: false },
        { isRevoked: true },
      )
    })
  })
})
