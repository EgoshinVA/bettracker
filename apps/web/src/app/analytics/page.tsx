'use client'

import { TrendingUp, Target, Percent, Scale, AlertTriangle, Bell, BarChart2 } from 'lucide-react'
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
import { AppShell } from '@/widgets/app-shell/ui/AppShell'
import { mockProfitData, mockSports, mockBookmakers } from '@/shared/lib/mock-data'

const periods = ['7D', '30D', '90D', 'YTD']

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

export default function AnalyticsPage() {
  return (
    <AppShell headerProps={{ placeholder: 'Search analytics...', showAvatar: true }}>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Comprehensive breakdown of your wagering portfolio.</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          {periods.map((p) => (
            <button
              key={p}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                p === '30D'
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
        <MetricCard label="Total Profit" value="$12,450.80" delta="+12.4%" positive icon={TrendingUp} />
        <MetricCard label="Win Rate" value="58.4%" delta="+2.1%" positive note="vs last period" icon={Target} />
        <MetricCard label="ROI" value="14.2%" delta="-0.5%" positive={false} note="Stable" icon={Percent} />
        <MetricCard label="Avg. Odds" value="2.10" delta="Stable" positive icon={Scale} />
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
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockProfitData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: 12 }}
                formatter={(v: number) => [`$${v}`, '']}
              />
              <Area type="monotone" dataKey="profit" stroke="#7c3aed" strokeWidth={2} fill="url(#profitGrad)" />
              <Area type="monotone" dataKey="avg" stroke="#c4b5fd" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
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
          <div className="flex flex-col items-center">
            <div className="relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={mockSports}
                  cx={75}
                  cy={75}
                  innerRadius={50}
                  outerRadius={72}
                  dataKey="pct"
                  strokeWidth={0}
                >
                  {mockSports.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Leader</p>
                <p className="text-sm font-bold text-slate-900">NBA</p>
              </div>
            </div>
            <div className="mt-2 w-full space-y-2">
              {mockSports.map((s) => (
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
        <div className="space-y-4">
          {mockBookmakers.map((bk) => (
            <div key={bk.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{bk.name}</span>
                <span className="text-slate-500">
                  ${bk.volume.toLocaleString()}{' '}
                  <span className={`font-semibold ${bk.roi > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    | {bk.roi > 0 ? '+' : ''}{bk.roi}%
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{ width: `${(bk.volume / 60000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
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
    </AppShell>
  )
}
