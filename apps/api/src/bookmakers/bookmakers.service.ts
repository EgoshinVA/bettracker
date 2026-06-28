import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BetResult } from '@bettracker/shared'
import { Bookmaker } from './entities/bookmaker.entity'
import { CreateBookmakerDto } from './dto/create-bookmaker.dto'
import { UpdateBookmakerDto } from './dto/update-bookmaker.dto'

@Injectable()
export class BookmakersService {
  constructor(
    @InjectRepository(Bookmaker)
    private readonly bookmakersRepository: Repository<Bookmaker>,
  ) {}

  async create(userId: string, dto: CreateBookmakerDto): Promise<Bookmaker> {
    const exists = await this.bookmakersRepository.findOne({
      where: { name: dto.name, user: { id: userId } },
    })
    if (exists) throw new ConflictException(`Bookmaker "${dto.name}" already exists`)

    const bookmaker = this.bookmakersRepository.create({
      ...dto,
      user: { id: userId },
    })
    return this.bookmakersRepository.save(bookmaker)
  }

  async findAll(userId: string): Promise<Bookmaker[]> {
    return this.bookmakersRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    })
  }

  async findOne(userId: string, id: string): Promise<Bookmaker> {
    const bookmaker = await this.bookmakersRepository.findOne({
      where: { id, user: { id: userId } },
    })
    if (!bookmaker) throw new NotFoundException(`Bookmaker ${id} not found`)
    return bookmaker
  }

  async update(userId: string, id: string, dto: UpdateBookmakerDto): Promise<Bookmaker> {
    const bookmaker = await this.findOne(userId, id)
    Object.assign(bookmaker, dto)
    return this.bookmakersRepository.save(bookmaker)
  }

  async remove(userId: string, id: string): Promise<void> {
    const bookmaker = await this.findOne(userId, id)
    await this.bookmakersRepository.remove(bookmaker)
  }

  async getStats(userId: string) {
    const bookmakers = await this.bookmakersRepository.find({
      where: { user: { id: userId } },
      relations: ['bets'],
      order: { name: 'ASC' },
    })

    const totalVolume = bookmakers.reduce((sum, bk) => {
      return sum + bk.bets.reduce((s, b) => s + Number(b.stake), 0)
    }, 0)

    return bookmakers.map((bk) => {
      const settled = bk.bets.filter((b) => b.result !== BetResult.PENDING)
      const won = settled.filter((b) => b.result === BetResult.WON)
      const volume = bk.bets.reduce((s, b) => s + Number(b.stake), 0)
      const settledVolume = settled.reduce((s, b) => s + Number(b.stake), 0)
      const profit = settled.reduce((s, b) => s + Number(b.profit ?? 0), 0)
      const roi = settledVolume ? Math.round((profit / settledVolume) * 100 * 10) / 10 : 0

      return {
        bookmaker: bk,
        totalBets: bk.bets.length,
        volume,
        profit: Math.round(profit * 100) / 100,
        roi,
        winRate: settled.length ? Math.round((won.length / settled.length) * 100) : 0,
        volumePct: totalVolume ? Math.round((volume / totalVolume) * 100) : 0,
      }
    })
  }
}
