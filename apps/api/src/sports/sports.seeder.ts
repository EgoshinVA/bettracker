import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sport } from './entities/sport.entity'

const SPORTS = [
  { name: 'Football', slug: 'football', isEsport: false },
  { name: 'American Football', slug: 'american-football', isEsport: false },
  { name: 'Basketball', slug: 'basketball', isEsport: false },
  { name: 'Baseball', slug: 'baseball', isEsport: false },
  { name: 'Ice Hockey', slug: 'ice-hockey', isEsport: false },
  { name: 'Tennis', slug: 'tennis', isEsport: false },
  { name: 'MMA', slug: 'mma', isEsport: false },
  { name: 'Boxing', slug: 'boxing', isEsport: false },
  { name: 'Golf', slug: 'golf', isEsport: false },
  { name: 'Rugby', slug: 'rugby', isEsport: false },
  { name: 'Cricket', slug: 'cricket', isEsport: false },
  { name: 'Volleyball', slug: 'volleyball', isEsport: false },
  { name: 'CS2', slug: 'cs2', isEsport: true },
  { name: 'Dota 2', slug: 'dota2', isEsport: true },
  { name: 'League of Legends', slug: 'lol', isEsport: true },
  { name: 'Valorant', slug: 'valorant', isEsport: true },
  { name: 'Overwatch 2', slug: 'overwatch2', isEsport: true },
  { name: 'Rocket League', slug: 'rocket-league', isEsport: true },
  { name: 'StarCraft II', slug: 'sc2', isEsport: true },
  { name: 'PUBG', slug: 'pubg', isEsport: true },
]

@Injectable()
export class SportsSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Sport)
    private readonly sportsRepo: Repository<Sport>,
  ) {}

  async onModuleInit() {
    for (const seed of SPORTS) {
      const exists = await this.sportsRepo.findOneBy({ slug: seed.slug })
      if (!exists) {
        await this.sportsRepo.save(this.sportsRepo.create({ ...seed, isActive: true }))
      }
    }
  }
}
