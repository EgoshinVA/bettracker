import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SportsService } from './sports.service'
import { Sport } from './entities/sport.entity'

const mockSports: Sport[] = [
  { id: '1', name: 'Basketball', slug: 'basketball', isEsport: false, isActive: true },
  { id: '2', name: 'Football', slug: 'football', isEsport: false, isActive: true },
  { id: '3', name: 'CS2', slug: 'cs2', isEsport: true, isActive: true },
  { id: '4', name: 'Dota 2', slug: 'dota2', isEsport: true, isActive: true },
]

const mockRepo = { find: jest.fn() }

describe('SportsService', () => {
  let service: SportsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        { provide: getRepositoryToken(Sport), useValue: mockRepo },
      ],
    }).compile()

    service = module.get<SportsService>(SportsService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return active sports ordered by isEsport then name', async () => {
      mockRepo.find.mockResolvedValue(mockSports)

      const result = await service.findAll()

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { isEsport: 'ASC', name: 'ASC' },
      })
      expect(result).toEqual(mockSports)
    })

    it('should return empty array when no sports exist', async () => {
      mockRepo.find.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })
})
