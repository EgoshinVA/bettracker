import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { User } from '../users/entities/user.entity'

const mockPublicUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.USER,
  isEmailVerified: false,
  subscriptionStatus: SubscriptionStatus.FREE,
  subscriptionExpiresAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

const mockAuthResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: mockPublicUser,
}

const mockTokens = { accessToken: 'access-token', refreshToken: 'new-refresh-token' }
const mockUser = { id: 'user-1' } as User

describe('AuthController', () => {
  let controller: AuthController
  let service: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockService = {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      revokeAllUserTokens: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get(AuthService)
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should call register with dto and return auth response', async () => {
      service.register.mockResolvedValue(mockAuthResponse)
      const dto = { email: 'test@example.com', name: 'Test User', password: 'password123' }

      const result = await controller.register(dto)

      expect(service.register).toHaveBeenCalledWith(dto)
      expect(result).toEqual(mockAuthResponse)
    })
  })

  describe('login', () => {
    it('should call login with dto and return auth response', async () => {
      service.login.mockResolvedValue(mockAuthResponse)
      const dto = { email: 'test@example.com', password: 'password123' }

      const result = await controller.login(dto)

      expect(service.login).toHaveBeenCalledWith(dto)
      expect(result).toEqual(mockAuthResponse)
    })
  })

  describe('refresh', () => {
    it('should call refresh with refreshToken from dto and return new tokens', async () => {
      service.refresh.mockResolvedValue(mockTokens)
      const dto = { refreshToken: 'refresh-token' }

      const result = await controller.refresh(dto)

      expect(service.refresh).toHaveBeenCalledWith('refresh-token')
      expect(result).toEqual(mockTokens)
    })
  })

  describe('logout', () => {
    it('should call logout with refreshToken from dto', async () => {
      service.logout.mockResolvedValue(undefined)
      const dto = { refreshToken: 'refresh-token' }

      await controller.logout(dto)

      expect(service.logout).toHaveBeenCalledWith('refresh-token')
    })
  })

  describe('logoutAll', () => {
    it('should call revokeAllUserTokens with current user id', async () => {
      service.revokeAllUserTokens.mockResolvedValue(undefined)

      await controller.logoutAll(mockUser)

      expect(service.revokeAllUserTokens).toHaveBeenCalledWith('user-1')
    })
  })
})
