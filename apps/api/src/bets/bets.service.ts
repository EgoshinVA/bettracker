import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BetResult } from '@bettracker/shared'
import { Bet } from './entities/bet.entity'
import { CreateBetDto } from './dto/create-bet.dto'

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betsRepository: Repository<Bet>
  ) {}

  async createBet(userId: string, dto: CreateBetDto): Promise<Bet> {
    const { bookmakerId, ...rest } = dto
    const bet = this.betsRepository.create({
      ...rest,
      result: BetResult.PENDING,
      user: { id: userId },
      bookmaker: bookmakerId ? { id: bookmakerId } : null,
    })
    return this.betsRepository.save(bet)
  }

  async findAll(userId: string): Promise<Bet[]> {
    return this.betsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(userId: string, id: string): Promise<Bet> {
    const bet = await this.betsRepository.findOne({
      where: { id, user: { id: userId } },
    })
    if (!bet) throw new NotFoundException(`Bet ${id} not found`)
    return bet
  }

  async updateResult(userId: string, id: string, result: BetResult): Promise<Bet> {
    const bet = await this.findOne(userId, id)
    bet.result = result
    if (result === BetResult.WON) {
      bet.profit = Number((bet.stake * bet.odds - bet.stake).toFixed(2))
    } else if (result === BetResult.LOST) {
      bet.profit = -Number(bet.stake)
    }
    return this.betsRepository.save(bet)
  }

  async remove(userId: string, id: string): Promise<void> {
    const bet = await this.findOne(userId, id)
    await this.betsRepository.remove(bet)
  }

  async getStats(userId: string) {
    const bets = await this.findAll(userId)
    const settled = bets.filter((b) => b.result !== BetResult.PENDING)
    const won = settled.filter((b) => b.result === BetResult.WON)
    const totalStake = settled.reduce((s, b) => s + Number(b.stake), 0)
    const totalProfit = settled.reduce((s, b) => s + Number(b.profit ?? 0), 0)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthlySettled = settled.filter((b) => b.createdAt >= startOfMonth)
    const prevMonthSettled = settled.filter(
      (b) => b.createdAt >= prevMonthStart && b.createdAt < startOfMonth,
    )

    const netProfitMonthly = monthlySettled.reduce((s, b) => s + Number(b.profit ?? 0), 0)
    const prevMonthProfit = prevMonthSettled.reduce((s, b) => s + Number(b.profit ?? 0), 0)
    const prevMonthStake = prevMonthSettled.reduce((s, b) => s + Number(b.stake), 0)

    const roi = totalStake ? Math.round((totalProfit / totalStake) * 100 * 10) / 10 : 0
    const prevRoi = prevMonthStake
      ? Math.round((prevMonthProfit / prevMonthStake) * 100 * 10) / 10
      : 0

    return {
      totalBets: bets.length,
      settledBets: settled.length,
      winRate: settled.length ? Math.round((won.length / settled.length) * 100) : 0,
      roi,
      roiDelta: Math.round((roi - prevRoi) * 10) / 10,
      netProfit: Math.round(totalProfit * 100) / 100,
      netProfitMonthly: Math.round(netProfitMonthly * 100) / 100,
    }
  }
}
