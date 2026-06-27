'use client'

import { useSession } from 'next-auth/react'
import { TrendingUp, BarChart2, ShieldCheck, DollarSign, ArrowRight, Zap } from 'lucide-react'
import { AppShell } from '@/widgets/app-shell/ui/AppShell'
import { ResultBadge } from '@/shared/ui/ResultBadge'
import { mockStats, mockBets, mockBookmakers } from '@/shared/lib/mock-data'

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

export default function DashboardPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <AppShell placeholder="Search events, bookies, or bet types...">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your betting portfolio is up{' '}
          <span className="font-semibold text-green-500">+{mockStats.roi}%</span> this month. Keep it up!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <StatCard
          label="Return on Investment"
          value={`+${mockStats.roi}%`}
          delta={`${mockStats.roiDelta}%`}
          deltaPositive
          icon={TrendingUp}
        />
        <StatCard
          label="Total Bets Placed"
          value={String(mockStats.totalBets)}
          icon={BarChart2}
        />
        <StatCard
          label="Win Rate"
          value={`${mockStats.winRate}%`}
          badge="Top 5%"
          icon={ShieldCheck}
        />
        <StatCard
          label="Net Profit (Monthly)"
          value={`$${mockStats.netProfit.toLocaleString()}`}
          accentValue
          icon={DollarSign}
        />
      </div>

      {/* Recent Bets */}
      <div className="mb-6 rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Recent Bets</h2>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {['Date', 'Event', 'Bet Type', 'Odds', 'Stake', 'Result'].map((h) => (
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
              {mockBets.map((bet) => (
                <tr key={bet.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(bet.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{bet.match}</p>
                    <p className="text-xs text-slate-400">{bet.league}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{bet.betType}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{bet.odds}</td>
                  <td className="px-6 py-4 text-slate-600">${bet.stake.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <ResultBadge result={bet.result} />
                  </td>
                </tr>
              ))}
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
              <h3 className="text-lg font-bold">Unlock High-Yield Parlays</h3>
              <p className="mt-2 max-w-sm text-sm text-violet-200">
                Our algorithm detected a value discrepancy in tonight's Champions League fixtures. Users
                with Pro Plan are seeing 15% better returns on these specific set markets.
              </p>
              <button className="mt-4 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                Upgrade Now
              </button>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10">
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>

        {/* Top Bookmakers */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Top Bookmakers</h3>
          <div className="space-y-3">
            {mockBookmakers.slice(0, 3).map((bk) => (
              <div key={bk.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ backgroundColor: bk.color }}
                  >
                    {bk.shortName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{bk.name}</span>
                </div>
                <span className="text-sm font-semibold text-violet-600">{bk.volumePct}% Vol.</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-xs font-medium text-slate-400 hover:text-violet-600 transition-colors">
            Manage Bookies
          </button>
        </div>
      </div>
    </AppShell>
  )
}
