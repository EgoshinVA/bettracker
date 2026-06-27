import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { User } from './entities/user.entity'

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed',
  role: UserRole.USER,
  isEmailVerified: false,
  subscriptionStatus: SubscriptionStatus.FREE,
  subscriptionExpiresAt: null,
  bets: [],
  refreshTokens: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('UsersController', () => {
  let controller: UsersController
  let service: Record<string, jest.Mock>

  beforeEach(async () => {
    const mockService = { updateProfile: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get(UsersService)
    jest.clearAllMocks()
  })

  describe('updateMe', () => {
    it('should call updateProfile with current user id and dto', async () => {
      const updated = { ...mockUser, name: 'New Name' }
      service.updateProfile.mockResolvedValue(updated)
      const dto = { name: 'New Name' }

      const result = await controller.updateMe(mockUser, dto)

      expect(service.updateProfile).toHaveBeenCalledWith('user-1', dto)
      expect(result.name).toBe('New Name')
    })

    it('should call updateProfile with email dto', async () => {
      const updated = { ...mockUser, email: 'new@example.com' }
      service.updateProfile.mockResolvedValue(updated)
      const dto = { email: 'new@example.com' }

      const result = await controller.updateMe(mockUser, dto)

      expect(service.updateProfile).toHaveBeenCalledWith('user-1', dto)
      expect(result.email).toBe('new@example.com')
    })

    it('should propagate ConflictException when email is taken', async () => {
      service.updateProfile.mockRejectedValue(new ConflictException('Email is already in use'))

      await expect(
        controller.updateMe(mockUser, { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictException)
    })

    it('should propagate NotFoundException when user does not exist', async () => {
      service.updateProfile.mockRejectedValue(new NotFoundException('User not found'))

      await expect(
        controller.updateMe(mockUser, { name: 'Name' }),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
