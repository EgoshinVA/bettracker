'use client'

import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BetType } from '@/shared/lib/types'
import { useCreateBetMutation } from '@/entities/bet/api/bets.api'
import { useGetBookmakersQuery } from '@/entities/bookmaker/api/bookmakers.api'
import { useGetSportsQuery } from '@/entities/sport/api/sports.api'
import { useCurrency } from '@/shared/lib/use-currency'

interface AddBetModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AddBetFormData {
  sport: string
  league: string
  match: string
  odds: string
  stake: string
  betType: BetType
  bookmakerId: string
  notes: string
}

const BET_TYPE_OPTIONS: { label: string; value: BetType }[] = [
  { label: 'Moneyline', value: BetType.MONEYLINE },
  { label: 'Spread', value: BetType.SPREAD },
  { label: 'Over/Under', value: BetType.OVER_UNDER },
  { label: 'Parlay', value: BetType.PARLAY },
  { label: 'BTTS', value: BetType.BTTS },
]

export function AddBetModal({ isOpen, onClose }: AddBetModalProps) {
  const { data: sports = [], isLoading: sportsLoading } = useGetSportsQuery()
  const { data: bookmakers = [] } = useGetBookmakersQuery()
  const [createBet, { isLoading }] = useCreateBetMutation()
  const { symbol, code, toUsd } = useCurrency()

  const regularSports = sports.filter((s) => !s.isEsport)
  const esports = sports.filter((s) => s.isEsport)
  const firstSport = sports[0]?.name ?? ''

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddBetFormData>({
    defaultValues: { sport: firstSport, betType: BetType.MONEYLINE, bookmakerId: '' },
  })

  const onSubmit = async (data: AddBetFormData) => {
    const stakeInDisplay = parseFloat(data.stake)
    const stakeUsd = toUsd(stakeInDisplay)

    try {
      await createBet({
        sport: data.sport,
        league: data.league,
        match: data.match,
        odds: parseFloat(data.odds),
        stake: stakeUsd,
        betType: data.betType,
        notes: data.notes || undefined,
        bookmakerId: data.bookmakerId || undefined,
      }).unwrap()

      toast.success(`Bet added — ${data.sport} · ${data.league || data.betType}`)
      reset()
      onClose()
    } catch {
      toast.error('Failed to add bet. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Bet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Amounts in <span className="font-semibold text-violet-600">{code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sport + League */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Sport</label>
              <select
                {...register('sport', { required: true })}
                disabled={sportsLoading}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
              >
                {regularSports.length > 0 && (
                  <optgroup label="Sports">
                    {regularSports.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </optgroup>
                )}
                {esports.length > 0 && (
                  <optgroup label="Esports">
                    {esports.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </optgroup>
                )}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">League</label>
              <input
                {...register('league', { required: 'League is required' })}
                placeholder="e.g. Premier League"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              {errors.league && <p className="mt-1 text-xs text-red-500">{errors.league.message}</p>}
            </div>
          </div>

          {/* Match */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Match</label>
            <input
              {...register('match', { required: 'Match is required' })}
              placeholder="e.g. Manchester City vs Arsenal"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.match && <p className="mt-1 text-xs text-red-500">{errors.match.message}</p>}
          </div>

          {/* Odds + Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Odds</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                <input
                  {...register('odds', {
                    required: 'Odds is required',
                    min: { value: 1.01, message: 'Odds must be ≥ 1.01' },
                  })}
                  placeholder="1.95"
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              {errors.odds && <p className="mt-1 text-xs text-red-500">{errors.odds.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stake <span className="text-slate-400">({code})</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{symbol}</span>
                <input
                  {...register('stake', {
                    required: 'Stake is required',
                    min: { value: 0.01, message: 'Stake must be > 0' },
                  })}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              {errors.stake && <p className="mt-1 text-xs text-red-500">{errors.stake.message}</p>}
            </div>
          </div>

          {/* Bet Type + Bookmaker */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Bet Type</label>
              <select
                {...register('betType', { required: true })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {BET_TYPE_OPTIONS.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Bookmaker <span className="text-slate-400">(Optional)</span>
              </label>
              <select
                {...register('bookmakerId')}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="">None</option>
                {bookmakers.map((bk) => (
                  <option key={bk.id} value={bk.id}>{bk.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notes <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Analysis notes, injury reports, weather..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Confirm Bet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
