'use client'

import { TrendingUp, TrendingDown, DollarSign, BarChart2, Plus } from 'lucide-react'
import { mockBookmakers, mockStats } from '@/shared/lib/mock-data'

const totalVolume = mockBookmakers.reduce((sum, bk) => sum + bk.volume, 0)

function RoiBadge({ roi }: { roi: number }) {
  const positive = roi >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? '+' : ''}{roi}%
    </span>
  )
}

export default function BookmakersPage() {
  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookmakers</h1>
          <p className="mt-1 text-sm text-slate-500">Performance breakdown across all platforms.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Add Bookmaker
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          {
            label: 'Platforms',
            value: mockBookmakers.length,
            icon: BarChart2,
          },
          {
            label: 'Total Volume',
            value: `$${totalVolume.toLocaleString()}`,
            icon: DollarSign,
          },
          {
            label: 'Best ROI',
            value: `+${Math.max(...mockBookmakers.map((b) => b.roi))}%`,
            icon: TrendingUp,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Icon className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bookmaker cards */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        {mockBookmakers.map((bk) => {
          const shareWidth = `${bk.volumePct}%`
          return (
            <div
              key={bk.id}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ backgroundColor: bk.color }}
                  >
                    {bk.shortName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{bk.name}</p>
                    <p className="text-xs text-slate-400">{bk.shortName}</p>
                  </div>
                </div>
                <RoiBadge roi={bk.roi} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Volume</p>
                  <p className="mt-1 font-semibold text-slate-900">${bk.volume.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Portfolio Share</p>
                  <p className="mt-1 font-semibold text-slate-900">{bk.volumePct}%</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Share of total volume</span>
                  <span>{bk.volumePct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: shareWidth, backgroundColor: bk.color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-50 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Detailed Comparison</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-50">
              {['Bookmaker', 'Total Volume', 'Portfolio Share', 'ROI', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockBookmakers.map((bk) => (
              <tr key={bk.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: bk.color }}
                    >
                      {bk.shortName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">{bk.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">${bk.volume.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${bk.volumePct}%`, backgroundColor: bk.color }}
                      />
                    </div>
                    <span className="text-slate-500">{bk.volumePct}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoiBadge roi={bk.roi} />
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
