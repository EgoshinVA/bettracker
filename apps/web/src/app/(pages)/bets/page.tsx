'use client'

import { useState } from 'react'
import { BarChart2, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react'
import { AppShell } from '@/widgets/app-shell/ui/AppShell'
import { ResultBadge } from '@/shared/ui/ResultBadge'
import { mockBets } from '@/shared/lib/mock-data'
import { BetResult } from '@/shared/lib/types'

const SPORTS = ['All Sports', 'Football', 'Basketball', 'Tennis', 'American Football']
const RESULTS = ['All Results', BetResult.WON, BetResult.LOST, BetResult.PENDING]

const totalWon = mockBets.filter((b) => b.result === BetResult.WON).length
const totalLost = mockBets.filter((b) => b.result === BetResult.LOST).length
const totalPending = mockBets.filter((b) => b.result === BetResult.PENDING).length

export default function BetsPage() {
  const [sport, setSport] = useState('All Sports')
  const [result, setResult] = useState('All Results')

  const filtered = mockBets.filter((b) => {
    if (sport !== 'All Sports' && b.sport !== sport) return false
    if (result !== 'All Results' && b.result !== result) return false
    return true
  })

  return (
    <AppShell placeholder="Search bets...">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bets</h1>
          <p className="mt-1 text-sm text-slate-500">Full history of your wagers.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700">
          + Add Bet
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bets', value: mockBets.length, icon: BarChart2, color: 'text-violet-600 bg-violet-50' },
          { label: 'Won', value: totalWon, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
          { label: 'Lost', value: totalLost, icon: XCircle, color: 'text-red-600 bg-red-50' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3">
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {SPORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {RESULTS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        {(sport !== 'All Sports' || result !== 'All Results') && (
          <button
            onClick={() => { setSport('All Sports'); setResult('All Results') }}
            className="text-sm text-slate-400 underline-offset-2 hover:text-violet-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-sm text-slate-400">
          {filtered.length} bet{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bets table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {['Date', 'Event', 'Sport', 'Type', 'Odds', 'Stake', 'Profit/Loss', 'Result'].map((h) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                    No bets match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((bet) => (
                  <tr key={bet.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(bet.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{bet.match}</p>
                      <p className="text-xs text-slate-400">{bet.league}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{bet.sport}</td>
                    <td className="px-6 py-4 text-slate-600">{bet.betType}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{bet.odds}</td>
                    <td className="px-6 py-4 text-slate-600">${bet.stake.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {bet.profit !== null ? (
                        <span
                          className={`font-semibold ${bet.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
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
    </AppShell>
  )
}
