import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { BetResult } from '@bettracker/shared'
import { Bet } from '../bets/entities/bet.entity'
import { Bookmaker } from '../bookmakers/entities/bookmaker.entity'

export type Period = '7D' | '30D' | '90D' | 'YTD'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betsRepository: Repository<Bet>,
    @InjectRepository(Bookmaker)
    private readonly bookmakersRepository: Repository<Bookmaker>,
  ) {}

  async getOverview(userId: string, period: Period = '30D') {
    const since = this.periodToDate(period)
    const bets = await this.betsRepository.find({
      where: { user: { id: userId }, createdAt: Between(since, new Date()) },
      relations: ['bookmaker'],
      order: { createdAt: 'ASC' },
    })

    const settled = bets.filter((b) => b.result !== BetResult.PENDING)
    const won = settled.filter((b) => b.result === BetResult.WON)
    const totalStake = settled.reduce((s, b) => s + Number(b.stake), 0)
    const totalProfit = settled.reduce((s, b) => s + Number(b.profit ?? 0), 0)
    const avgOdds = bets.length
      ? Math.round((bets.reduce((s, b) => s + Number(b.odds), 0) / bets.length) * 100) / 100
      : 0

    return {
      totalProfit: Math.round(totalProfit * 100) / 100,
      winRate: settled.length ? Math.round((won.length / settled.length) * 100 * 10) / 10 : 0,
      roi: totalStake ? Math.round((totalProfit / totalStake) * 100 * 10) / 10 : 0,
      avgOdds,
      profitOverTime: this.buildProfitOverTime(bets, period),
      sportDistribution: this.buildSportDistribution(bets),
      bookmakerYield: this.buildBookmakerYield(bets),
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────────

  private periodToDate(period: Period): Date {
    const now = new Date()
    switch (period) {
      case '7D':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30D':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '90D':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      case 'YTD':
        return new Date(now.getFullYear(), 0, 1)
    }
  }

  private buildProfitOverTime(bets: Bet[], period: Period) {
    const now = new Date()
    const since = this.periodToDate(period)
    const settled = bets.filter((b) => b.result !== BetResult.PENDING)

    // YTD: one bucket per calendar month from Jan to current month — never produces future dates
    if (period === 'YTD') {
      const monthCount = now.getMonth() + 1
      return Array.from({ length: monthCount }, (_, m) => {
        const monthEnd = new Date(now.getFullYear(), m + 1, 1).getTime()
        const label = new Date(now.getFullYear(), m, 1).toLocaleDateString('en-US', { month: 'short' })
        const runningProfit = settled
          .filter((b) => b.createdAt.getTime() < monthEnd)
          .reduce((s, b) => s + Number(b.profit ?? 0), 0)
        return {
          date: label,
          profit: Math.round(runningProfit * 100) / 100,
          avg: Math.round((runningProfit / (m + 1)) * 100) / 100,
        }
      })
    }

    // Fixed periods: divide [since, now] into equal buckets — last bucket ends exactly at now
    const bucketCount = period === '7D' ? 7 : 6
    const sinceMs = since.getTime()
    const nowMs = now.getTime()
    const intervalMs = Math.floor((nowMs - sinceMs) / bucketCount)

    return Array.from({ length: bucketCount }, (_, i) => {
      const bucketStart = sinceMs + i * intervalMs
      const bucketEnd = i < bucketCount - 1 ? bucketStart + intervalMs : nowMs + 1
      const label = new Date(bucketStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const runningProfit = settled
        .filter((b) => b.createdAt.getTime() < bucketEnd)
        .reduce((s, b) => s + Number(b.profit ?? 0), 0)
      return {
        date: label,
        profit: Math.round(runningProfit * 100) / 100,
        avg: Math.round((runningProfit / (i + 1)) * 100) / 100,
      }
    })
  }

  private buildSportDistribution(bets: Bet[]) {
    if (!bets.length) return []

    const counts: Record<string, number> = {}
    for (const bet of bets) {
      counts[bet.sport] = (counts[bet.sport] ?? 0) + 1
    }

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([sport, count]) => ({
        sport,
        bets: count,
        pct: Math.round((count / bets.length) * 100),
      }))
  }

  private buildBookmakerYield(bets: Bet[]) {
    const byBookmaker: Record<string, { name: string; bets: Bet[] }> = {}

    for (const bet of bets) {
      if (!bet.bookmaker) continue
      const key = bet.bookmaker.id
      if (!byBookmaker[key]) byBookmaker[key] = { name: bet.bookmaker.name, bets: [] }
      byBookmaker[key].bets.push(bet)
    }

    const totalVolume = Object.values(byBookmaker).reduce(
      (s, { bets: bs }) => s + bs.reduce((ss, b) => ss + Number(b.stake), 0),
      0,
    )

    return Object.entries(byBookmaker).map(([id, { name, bets: bs }]) => {
      const settled = bs.filter((b) => b.result !== BetResult.PENDING)
      const volume = bs.reduce((s, b) => s + Number(b.stake), 0)
      const profit = settled.reduce((s, b) => s + Number(b.profit ?? 0), 0)
      const roi = volume ? Math.round((profit / volume) * 100 * 10) / 10 : 0

      return {
        id,
        name,
        volume,
        roi,
        volumePct: totalVolume ? Math.round((volume / totalVolume) * 100) : 0,
      }
    })
  }
}
