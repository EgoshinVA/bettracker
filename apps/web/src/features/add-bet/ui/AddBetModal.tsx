'use client'

import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

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
  betType: string
  notes: string
}

const sports = ['Football', 'Basketball', 'Tennis', 'Baseball', 'Hockey', 'MMA']
const betTypes = ['Moneyline', 'Spread', 'Over/Under', 'Parlay', 'BTTS', 'Both Teams to Score']

export function AddBetModal({ isOpen, onClose }: AddBetModalProps) {
  const { register, handleSubmit, reset } = useForm<AddBetFormData>()

  const onSubmit = (data: AddBetFormData) => {
    reset()
    onClose()
    toast.success(`Bet added — ${data.sport} · ${data.league || data.betType}`)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Bet</h2>
            <p className="mt-1 text-sm text-slate-500">Enter transaction details for professional tracking</p>
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
                {...register('sport')}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {sports.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">League</label>
              <input
                {...register('league')}
                placeholder="e.g. Premier League"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Match */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Match</label>
            <input
              {...register('match')}
              placeholder="e.g. Manchester City vs Arsenal"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Odds + Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Odds</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                <input
                  {...register('odds')}
                  placeholder="1.95"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stake</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input
                  {...register('stake')}
                  placeholder="100.00"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
          </div>

          {/* Bet Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Bet Type</label>
            <select
              {...register('betType')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {betTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
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
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Confirm Bet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
