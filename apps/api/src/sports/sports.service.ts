import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sport } from './entities/sport.entity'

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportsRepo: Repository<Sport>,
  ) {}

  findAll(): Promise<Sport[]> {
    return this.sportsRepo.find({
      where: { isActive: true },
      order: { isEsport: 'ASC', name: 'ASC' },
    })
  }
}
