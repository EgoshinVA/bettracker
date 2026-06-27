import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { JwtStrategy, JwtPayload } from './jwt.strategy'
import { UsersService } from '../../users/users.service'
import { User } from '../../users/entities/user.entity'

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
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let usersService: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockUsersService = { findById: jest.fn() }
    const mockConfigService = { getOrThrow: jest.fn().mockReturnValue('test-jwt-secret') }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
    usersService = module.get(UsersService)
    jest.clearAllMocks()
  })

  describe('validate', () => {
    const payload: JwtPayload = { sub: 'user-1', email: 'test@example.com' }

    it('should return user when found by id from payload', async () => {
      usersService.findById.mockResolvedValue(mockUser)

      const result = await strategy.validate(payload)

      expect(usersService.findById).toHaveBeenCalledWith('user-1')
      expect(result).toEqual(mockUser)
    })

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findById.mockResolvedValue(null)

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException)
    })
  })
})
