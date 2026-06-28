'use client'

import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, BarChart2, ShieldCheck, DollarSign, ArrowRight, Zap } from 'lucide-react'
import { ResultBadge } from '@/shared/ui/ResultBadge'
import { useGetBetStatsQuery, useGetBetsQuery } from '@/entities/bet/api/bets.api'
import { useGetBookmakerStatsQuery } from '@/entities/bookmaker/api/bookmakers.api'
import { useCurrency } from '@/shared/lib/use-currency'

function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  badge,
  icon: Icon,
  accentValue,
}: {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  badge?: string
  icon: React.ElementType
  accentValue?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
          <Icon className="h-5 w-5 text-violet-600" />
        </div>
        {badge && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
            {badge}
          </span>
        )}
        {delta && (
          <span className={`text-sm font-semibold ${deltaPositive ? 'text-green-500' : 'text-red-500'}`}>
            {deltaPositive ? '+' : ''}{delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accentValue ? 'text-violet-600' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-slate-100" />
      <div className="mt-4 h-3 w-24 rounded bg-slate-100" />
      <div className="mt-2 h-8 w-32 rounded bg-slate-100" />
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  const { data: stats, isLoading: statsLoading } = useGetBetStatsQuery()
  const { data: bets, isLoading: betsLoading } = useGetBetsQuery()
  const { data: bookmakerStats, isLoading: bookmakersLoading } = useGetBookmakerStatsQuery()
  const { format } = useCurrency()

  const recentBets = bets?.slice(0, 5) ?? []
  const topBookmakers = bookmakerStats?.slice(0, 3) ?? []

  return (
    <>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.welcomeBack', { name: firstName })}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {stats ? (
            stats.roi >= 0 ? (
              <>
                {t('dashboard.portfolioUpPrefix')}{' '}
                <span className="font-semibold text-green-500">+{stats.roi}%</span>{' '}
                {t('dashboard.portfolioUpSuffix')}
              </>
            ) : (
              <>
                {t('dashboard.portfolioDownPrefix')}{' '}
                <span className="font-semibold text-red-500">{stats.roi}%</span>{' '}
                {t('dashboard.portfolioDownSuffix')}
              </>
            )
          ) : (
            t('dashboard.loadingPortfolio')
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label={t('stats.roi')}
              value={`${stats?.roi ?? 0 >= 0 ? '+' : ''}${stats?.roi ?? 0}%`}
              delta={`${stats?.roiDelta ?? 0}%`}
              deltaPositive={(stats?.roiDelta ?? 0) >= 0}
              icon={TrendingUp}
            />
            <StatCard
              label={t('stats.totalBets')}
              value={String(stats?.totalBets ?? 0)}
              icon={BarChart2}
            />
            <StatCard
              label={t('stats.winRate')}
              value={`${stats?.winRate ?? 0}%`}
              badge={t('stats.top5')}
              icon={ShieldCheck}
            />
            <StatCard
              label={t('stats.netProfit')}
              value={format(stats?.netProfitMonthly ?? 0)}
              accentValue
              icon={DollarSign}
            />
          </>
        )}
      </div>

      {/* Recent Bets */}
      <div className="mb-6 rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">{t('dashboard.recentBets')}</h2>
          </div>
          <a href="/bets" className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
            {t('dashboard.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {[t('table.date'), t('table.event'), t('table.betType'), t('table.odds'), t('table.stake'), t('table.result')].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {betsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentBets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    {t('dashboard.noBetsYet')}
                  </td>
                </tr>
              ) : (
                recentBets.map((bet) => (
                  <tr key={bet.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(bet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{bet.match}</p>
                      <p className="text-xs text-slate-400">{bet.league}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{bet.betType}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{bet.odds}</td>
                    <td className="px-6 py-4 text-slate-600">{format(Number(bet.stake))}</td>
                    <td className="px-6 py-4">
                      <ResultBadge result={bet.result} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Upsell Banner */}
        <div className="col-span-2 rounded-xl bg-violet-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{t('dashboard.unlockParlays')}</h3>
              <p className="mt-2 max-w-sm text-sm text-violet-200">
                {t('dashboard.parlayCopy')}
              </p>
              <button className="mt-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                {t('dashboard.upgradeNow')}
              </button>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10">
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>

        {/* Top Bookmakers */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">{t('dashboard.topBookmakers')}</h3>
          {bookmakersLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-slate-100" />
                  <div className="h-4 w-24 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : topBookmakers.length === 0 ? (
            <p className="text-sm text-slate-400">{t('dashboard.noBookmakers')}</p>
          ) : (
            <div className="space-y-3">
              {topBookmakers.map(({ bookmaker, volumePct }) => (
                <div key={bookmaker.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: bookmaker.color }}
                    >
                      {bookmaker.shortName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{bookmaker.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-violet-600">{volumePct}% Vol.</span>
                </div>
              ))}
            </div>
          )}
          <a href="/bookmakers" className="mt-4 block w-full text-center text-xs font-medium text-slate-400 hover:text-violet-600 transition-colors">
            {t('dashboard.manageBookies')}
          </a>
        </div>
      </div>
    </>
  )
}
