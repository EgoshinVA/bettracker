'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart2, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react'
import { ResultBadge } from '@/shared/ui/ResultBadge'
import { useGetBetsQuery, useUpdateBetResultMutation } from '@/entities/bet/api/bets.api'
import { BetResult } from '@/shared/lib/types'
import { AddBetModal } from '@/features/add-bet/ui/AddBetModal'
import { useCurrency } from '@/shared/lib/use-currency'
import type { Bet } from '@bettracker/shared'
import { useGetSportsQuery } from '@/entities/sport/api/sports.api'

const ALL_SPORTS = 'all'
const ALL_RESULTS = 'all'

export default function BetsPage() {
  const { t } = useTranslation()
  const [sport, setSport] = useState(ALL_SPORTS)
  const [result, setResult] = useState(ALL_RESULTS)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [updatingBetId, setUpdatingBetId] = useState<string | null>(null)

  const { data: bets = [], isLoading } = useGetBetsQuery()
  const { data: sports = [] } = useGetSportsQuery()
  const [updateResult] = useUpdateBetResultMutation()
  const { format, symbol } = useCurrency()

  const sportOptions = [
    { value: ALL_SPORTS, label: t('bets.allSports') },
    ...sports.map((s) => ({ value: s.name, label: s.name })),
  ]

  const resultOptions = [
    { value: ALL_RESULTS, label: t('bets.allResults') },
    { value: BetResult.WON, label: t('bets.won') },
    { value: BetResult.LOST, label: t('bets.lost') },
    { value: BetResult.PENDING, label: t('bets.pending') },
  ]

  const totalWon = bets.filter((b) => b.result === BetResult.WON).length
  const totalLost = bets.filter((b) => b.result === BetResult.LOST).length
  const totalPending = bets.filter((b) => b.result === BetResult.PENDING).length

  const filtered = bets.filter((b) => {
    if (sport !== ALL_SPORTS && b.sport !== sport) return false
    if (result !== ALL_RESULTS && b.result !== result) return false
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

  const summaryCards = [
    { label: t('bets.totalBets'), value: bets.length, icon: BarChart2, color: 'text-violet-600 bg-violet-50' },
    { label: t('bets.won'), value: totalWon, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: t('bets.lost'), value: totalLost, icon: XCircle, color: 'text-red-600 bg-red-50' },
    { label: t('bets.pending'), value: totalPending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('bets.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('bets.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          {t('bets.addBet')}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
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
          {sportOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {resultOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        {(sport !== ALL_SPORTS || result !== ALL_RESULTS) && (
          <button
            onClick={() => { setSport(ALL_SPORTS); setResult(ALL_RESULTS) }}
            className="text-sm text-slate-400 underline-offset-2 hover:text-violet-600 hover:underline"
          >
            {t('bets.clearFilters')}
          </button>
        )}
        <span className="ml-auto text-sm text-slate-400">
          {isLoading ? '...' : t('bets.count', { count: filtered.length })}
        </span>
      </div>

      {/* Bets table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {[
                  t('table.date'),
                  t('table.event'),
                  t('table.sport'),
                  t('table.type'),
                  t('table.odds'),
                  `${t('table.stake')} (${symbol})`,
                  `${t('table.pl')} (${symbol})`,
                  t('table.result'),
                ].map((h) => (
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
                    {bets.length === 0 ? t('bets.noBets') : t('bets.noFiltered')}
                  </td>
                </tr>
              ) : (
                filtered.map((bet) => {
                  const isPending = bet.result === BetResult.PENDING
                  const isUpdating = updatingBetId === bet.id

                  return (
                    <tr key={bet.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(bet.createdAt).toLocaleDateString(undefined, {
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
                              title={t('bets.titleWon')}
                              className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:opacity-40"
                            >
                              {t('bets.markWon')}
                            </button>
                            <button
                              onClick={() => handleSetResult(bet, BetResult.LOST)}
                              disabled={isUpdating}
                              title={t('bets.titleLost')}
                              className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40"
                            >
                              {t('bets.markLost')}
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
