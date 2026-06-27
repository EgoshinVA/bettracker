import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { UserRole, SubscriptionStatus } from '@bettracker/shared'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'

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

describe('UsersService', () => {
  let service: UsersService
  let repository: Record<string, jest.Mock>
  let mockQueryBuilder: Record<string, jest.Mock>

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    }

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get(getRepositoryToken(User))
    jest.clearAllMocks()
    repository.createQueryBuilder.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.where.mockReturnThis()
    mockQueryBuilder.addSelect.mockReturnThis()
  })

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser)

      const result = await service.findByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' })
    })

    it('should return null when user not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      const result = await service.findByEmail('notfound@example.com')

      expect(result).toBeNull()
    })

    it('should add password select when withPassword is true', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser)

      await service.findByEmail('test@example.com', true)

      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password')
    })

    it('should NOT add password select when withPassword is false', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser)

      await service.findByEmail('test@example.com', false)

      expect(mockQueryBuilder.addSelect).not.toHaveBeenCalled()
    })

    it('should normalise email to lowercase before querying', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser)

      await service.findByEmail('TEST@EXAMPLE.COM')

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' })
    })
  })

  describe('findById', () => {
    it('should return user when found by id', async () => {
      repository.findOne.mockResolvedValue(mockUser)

      const result = await service.findById('user-1')

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'user-1' } })
      expect(result).toEqual(mockUser)
    })

    it('should return null when user not found', async () => {
      repository.findOne.mockResolvedValue(null)

      const result = await service.findById('unknown-id')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and save a user with email lowercased', async () => {
      repository.create.mockReturnValue(mockUser)
      repository.save.mockResolvedValue(mockUser)
      const data = { email: 'TEST@EXAMPLE.COM', name: 'Test User', password: 'hashed' }

      const result = await service.create(data)

      expect(repository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
      })
      expect(repository.save).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockUser)
    })

    it('should return the saved user', async () => {
      repository.create.mockReturnValue(mockUser)
      repository.save.mockResolvedValue(mockUser)

      const result = await service.create({ email: 'a@b.com', name: 'A', password: 'p' })

      expect(result).toEqual(mockUser)
    })
  })

  describe('updateProfile', () => {
    it('should update name and return saved user', async () => {
      const updated = { ...mockUser, name: 'New Name' }
      repository.findOne.mockResolvedValue({ ...mockUser })
      repository.save.mockResolvedValue(updated)

      const result = await service.updateProfile('user-1', { name: 'New Name' })

      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }))
      expect(result.name).toBe('New Name')
    })

    it('should update email when it is not taken by another user', async () => {
      const updated = { ...mockUser, email: 'new@example.com' }
      repository.findOne.mockResolvedValue({ ...mockUser })
      mockQueryBuilder.getOne.mockResolvedValue(null)
      repository.save.mockResolvedValue(updated)

      const result = await service.updateProfile('user-1', { email: 'new@example.com' })

      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@example.com' }))
      expect(result.email).toBe('new@example.com')
    })

    it('should allow setting the same email the user already has', async () => {
      repository.findOne.mockResolvedValue({ ...mockUser })
      mockQueryBuilder.getOne.mockResolvedValue({ ...mockUser }) // same id
      repository.save.mockResolvedValue(mockUser)

      await expect(
        service.updateProfile('user-1', { email: 'test@example.com' }),
      ).resolves.toBeDefined()
    })

    it('should throw ConflictException when email belongs to another user', async () => {
      repository.findOne.mockResolvedValue({ ...mockUser })
      mockQueryBuilder.getOne.mockResolvedValue({ ...mockUser, id: 'user-2' })

      await expect(
        service.updateProfile('user-1', { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictException)
    })

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOne.mockResolvedValue(null)

      await expect(
        service.updateProfile('unknown', { name: 'Name' }),
      ).rejects.toThrow(NotFoundException)
    })

    it('should only update fields that are provided', async () => {
      repository.findOne.mockResolvedValue({ ...mockUser })
      repository.save.mockResolvedValue(mockUser)

      await service.updateProfile('user-1', { name: 'Only Name' })

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Only Name', email: mockUser.email }),
      )
    })
  })
})
