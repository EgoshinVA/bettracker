'use client'

import { useState } from 'react'
import { BarChart2, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react'
import { ResultBadge } from '@/shared/ui/ResultBadge'
import { useGetBetsQuery, useUpdateBetResultMutation } from '@/entities/bet/api/bets.api'
import { BetResult } from '@/shared/lib/types'
import { AddBetModal } from '@/features/add-bet/ui/AddBetModal'
import { useCurrency } from '@/shared/lib/use-currency'
import type { Bet } from '@bettracker/shared'
import { useGetSportsQuery } from '@/entities/sport/api/sports.api'

export default function BetsPage() {
  const [sport, setSport] = useState('All Sports')
  const [result, setResult] = useState('All Results')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [updatingBetId, setUpdatingBetId] = useState<string | null>(null)

  const { data: bets = [], isLoading } = useGetBetsQuery()
  const { data: sports = [] } = useGetSportsQuery()
  const [updateResult] = useUpdateBetResultMutation()
  const { format, symbol } = useCurrency()

  const sportNames = ['All Sports', ...sports.map((s) => s.name)]
  const resultOptions = ['All Results', BetResult.WON, BetResult.LOST, BetResult.PENDING]

  const totalWon = bets.filter((b) => b.result === BetResult.WON).length
  const totalLost = bets.filter((b) => b.result === BetResult.LOST).length
  const totalPending = bets.filter((b) => b.result === BetResult.PENDING).length

  const filtered = bets.filter((b) => {
    if (sport !== 'All Sports' && b.sport !== sport) return false
    if (result !== 'All Results' && b.result !== result) return false
    return true
  })

  const handleSetResult = async (bet: Bet, betResult: BetResult) => {
    setUpdatingBetId(bet.id)
    try {
      await updateResult({ id: bet.id, result: betResult }).unwrap()
    } finally {
      setUpdatingBetId(null)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bets</h1>
          <p className="mt-1 text-sm text-slate-500">Full history of your wagers.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          + Add Bet
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bets', value: bets.length, icon: BarChart2, color: 'text-violet-600 bg-violet-50' },
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
              {isLoading ? (
                <div className="mt-0.5 h-8 w-12 animate-pulse rounded bg-slate-100" />
              ) : (
                <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
              )}
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
          {sportNames.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {resultOptions.map((r) => <option key={r}>{r}</option>)}
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
          {isLoading ? '...' : `${filtered.length} bet${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Bets table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {['Date', 'Event', 'Sport', 'Type', 'Odds', `Stake (${symbol})`, `P/L (${symbol})`, 'Result'].map((h) => (
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-slate-100" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                    {bets.length === 0
                      ? 'No bets yet. Click "+ Add Bet" to get started.'
                      : 'No bets match the selected filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map((bet) => {
                  const isPending = bet.result === BetResult.PENDING
                  const isUpdating = updatingBetId === bet.id

                  return (
                    <tr key={bet.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(bet.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{bet.match}</p>
                        <p className="text-xs text-slate-400">{bet.league}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{bet.sport}</td>
                      <td className="px-6 py-4 text-slate-600">{bet.betType}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{bet.odds}</td>
                      <td className="px-6 py-4 text-slate-600">{format(Number(bet.stake))}</td>
                      <td className="px-6 py-4">
                        {bet.profit !== null ? (
                          <span className={`font-semibold ${Number(bet.profit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Number(bet.profit) >= 0 ? '+' : ''}{format(Number(bet.profit))}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isPending ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSetResult(bet, BetResult.WON)}
                              disabled={isUpdating}
                              title="Mark as Won"
                              className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:opacity-40"
                            >
                              Won
                            </button>
                            <button
                              onClick={() => handleSetResult(bet, BetResult.LOST)}
                              disabled={isUpdating}
                              title="Mark as Lost"
                              className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40"
                            >
                              Lost
                            </button>
                          </div>
                        ) : (
                          <ResultBadge result={bet.result} />
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddBetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  )
}
