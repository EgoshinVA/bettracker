'use client'

import { useState } from 'react'
import { TrendingUp, Target, Percent, Scale, AlertTriangle, Bell } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import { useGetAnalyticsOverviewQuery, type Period } from '@/entities/analytics/api/analytics.api'
import { useCurrency } from '@/shared/lib/use-currency'

const PERIODS: Period[] = ['7D', '30D', '90D', 'YTD']

const SPORT_COLORS: Record<string, string> = {
  Football: '#7c3aed',
  Soccer: '#7c3aed',
  Basketball: '#8b5cf6',
  NBA: '#8b5cf6',
  Tennis: '#a78bfa',
  'American Football': '#c4b5fd',
  NFL: '#c4b5fd',
  Baseball: '#ddd6fe',
  Hockey: '#6d28d9',
  MMA: '#5b21b6',
}
const FALLBACK_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6d28d9']

function getSportColor(sport: string, index: number): string {
  return SPORT_COLORS[sport] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

function MetricCard({
  label,
  value,
  delta,
  positive,
  note,
  icon: Icon,
}: {
  label: string
  value: string
  delta: string
  positive: boolean
  note?: string
  icon: React.ElementType
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-violet-400" />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className={`mt-1 text-sm font-semibold ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {delta} {note && <span className="font-normal text-slate-400">{note}</span>}
      </p>
    </div>
  )
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-3 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-7 w-24 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-16 rounded bg-slate-100" />
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30D')
  const { data, isLoading } = useGetAnalyticsOverviewQuery(period)
  const { format, toDisplay } = useCurrency()

  const sportDistributionWithColors = (data?.sportDistribution ?? []).map((s, i) => ({
    ...s,
    color: getSportColor(s.sport, i),
  }))

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Comprehensive breakdown of your wagering portfolio.</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                p === period
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Total Profit"
              value={format(data?.totalProfit ?? 0)}
              delta={`${(data?.totalProfit ?? 0) >= 0 ? '+' : ''}${data?.roi ?? 0}%`}
              positive={(data?.totalProfit ?? 0) >= 0}
              icon={TrendingUp}
            />
            <MetricCard
              label="Win Rate"
              value={`${data?.winRate ?? 0}%`}
              delta={`${data?.winRate ?? 0}%`}
              positive={(data?.winRate ?? 0) >= 50}
              note="of settled bets"
              icon={Target}
            />
            <MetricCard
              label="ROI"
              value={`${data?.roi ?? 0}%`}
              delta={`${(data?.roi ?? 0) >= 0 ? '+' : ''}${data?.roi ?? 0}%`}
              positive={(data?.roi ?? 0) >= 0}
              note="on stake"
              icon={Percent}
            />
            <MetricCard
              label="Avg. Odds"
              value={String(data?.avgOdds ?? '—')}
              delta="Stable"
              positive
              icon={Scale}
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {/* Profit over time */}
        <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Profit over Time</h3>
              <p className="text-xs text-slate-400">Net growth across all sport markets</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-[220px] animate-pulse rounded-lg bg-slate-50" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data?.profitOverTime ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => format(v, 0)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: 12 }}
                  formatter={(v: number, name: string) => [
                    format(v),
                    name === 'profit' ? 'Cumulative Profit' : 'Avg per interval',
                  ]}
                />
                <Area type="monotone" dataKey="profit" stroke="#7c3aed" strokeWidth={2} fill="url(#profitGrad)" />
                <Area type="monotone" dataKey="avg" stroke="#c4b5fd" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-4 rounded-full bg-violet-600" /> Profit Line
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-px w-4 border-t-2 border-dashed border-violet-300" /> Rolling Average
            </span>
          </div>
        </div>

        {/* Sport Distribution */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Sport Distribution</h3>
          {isLoading ? (
            <div className="mt-4 h-40 animate-pulse rounded-lg bg-slate-50" />
          ) : sportDistributionWithColors.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No bets in this period.</p>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative">
                <PieChart width={160} height={160}>
                  <Pie
                    data={sportDistributionWithColors}
                    cx={75}
                    cy={75}
                    innerRadius={50}
                    outerRadius={72}
                    dataKey="pct"
                    strokeWidth={0}
                  >
                    {sportDistributionWithColors.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Leader</p>
                  <p className="text-sm font-bold text-slate-900">
                    {sportDistributionWithColors[0]?.sport ?? '—'}
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full space-y-2">
                {sportDistributionWithColors.map((s) => (
                  <div key={s.sport} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.sport}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bookmaker Yield */}
      <div className="mb-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Bookmaker Yield Analysis</h3>
            <p className="text-xs text-slate-400">Efficiency per platform provider</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-violet-600" /> Total Turnover
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1.5 h-4 w-48 rounded bg-slate-100" />
                <div className="h-2.5 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (data?.bookmakerYield ?? []).length === 0 ? (
          <p className="text-sm text-slate-400">No bookmaker data for this period.</p>
        ) : (
          <div className="space-y-4">
            {(data?.bookmakerYield ?? []).map((bk) => {
              const maxVolume = Math.max(...(data?.bookmakerYield ?? []).map((b) => b.volume), 1)
              return (
                <div key={bk.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{bk.name}</span>
                    <span className="text-slate-500">
                      {format(bk.volume, 0)}{' '}
                      <span className={`font-semibold ${bk.roi > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        | {bk.roi > 0 ? '+' : ''}{bk.roi}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all"
                      style={{ width: `${(bk.volume / maxVolume) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Critical Performance Alerts</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: TrendingUp,
              color: 'text-green-600 bg-green-50',
              title: 'Optimal Odds Match',
              body: 'Pinnacle is currently offering 4.5% higher value on Tennis futures.',
            },
            {
              icon: Bell,
              color: 'text-violet-600 bg-violet-50',
              title: 'Portfolio Rebalance',
              body: 'NBA exposure exceeded 40%. Consider diversifying into Soccer markets.',
            },
            {
              icon: AlertTriangle,
              color: 'text-red-600 bg-red-50',
              title: 'High Risk Exposure',
              body: 'Upcoming NFL parlay has 85% stake concentration. Hedge suggested.',
            },
          ].map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="rounded-lg border border-slate-100 p-4">
              <div className={`mb-2 inline-flex rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
