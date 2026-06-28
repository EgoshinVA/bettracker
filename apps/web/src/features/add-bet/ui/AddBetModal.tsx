'use client'

import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
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

export function AddBetModal({ isOpen, onClose }: AddBetModalProps) {
  const { t } = useTranslation()
  const { data: sports = [], isLoading: sportsLoading } = useGetSportsQuery()
  const { data: bookmakers = [] } = useGetBookmakersQuery()
  const [createBet, { isLoading }] = useCreateBetMutation()
  const { symbol, code, toUsd } = useCurrency()

  const regularSports = sports.filter((s) => !s.isEsport)
  const esports = sports.filter((s) => s.isEsport)
  const firstSport = sports[0]?.name ?? ''

  const betTypeOptions = [
    { label: t('addBet.betTypeMoneyline'), value: BetType.MONEYLINE },
    { label: t('addBet.betTypeSpread'), value: BetType.SPREAD },
    { label: t('addBet.betTypeOverUnder'), value: BetType.OVER_UNDER },
    { label: t('addBet.betTypeParlay'), value: BetType.PARLAY },
    { label: t('addBet.betTypeBtts'), value: BetType.BTTS },
  ]

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddBetFormData>({
    defaultValues: { sport: firstSport, betType: BetType.MONEYLINE, bookmakerId: '' },
  })

  const onSubmit = async (data: AddBetFormData) => {
    const stakeUsd = toUsd(parseFloat(data.stake))

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

      toast.success(`${t('addBet.title')} — ${data.sport} · ${data.league || data.betType}`)
      reset()
      onClose()
    } catch {
      toast.error(t('addBet.addFailed'))
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
            <h2 className="text-xl font-bold text-slate-900">{t('addBet.title')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t('addBet.amountsIn')} <span className="font-semibold text-violet-600">{code}</span>
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('addBet.sport')}</label>
              <select
                {...register('sport', { required: true })}
                disabled={sportsLoading}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
              >
                {regularSports.length > 0 && (
                  <optgroup label={t('addBet.sports')}>
                    {regularSports.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </optgroup>
                )}
                {esports.length > 0 && (
                  <optgroup label={t('addBet.esports')}>
                    {esports.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </optgroup>
                )}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('addBet.league')}</label>
              <input
                {...register('league', { required: t('addBet.leagueRequired') })}
                placeholder={t('addBet.leaguePlaceholder')}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              {errors.league && <p className="mt-1 text-xs text-red-500">{errors.league.message}</p>}
            </div>
          </div>

          {/* Match */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('addBet.match')}</label>
            <input
              {...register('match', { required: t('addBet.matchRequired') })}
              placeholder={t('addBet.matchPlaceholder')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.match && <p className="mt-1 text-xs text-red-500">{errors.match.message}</p>}
          </div>

          {/* Odds + Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('addBet.odds')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                <input
                  {...register('odds', {
                    required: t('addBet.oddsRequired'),
                    min: { value: 1.01, message: t('addBet.oddsMin') },
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
                {t('addBet.stake')} <span className="text-slate-400">({code})</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{symbol}</span>
                <input
                  {...register('stake', {
                    required: t('addBet.stakeRequired'),
                    min: { value: 0.01, message: t('addBet.stakeMin') },
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('addBet.betType')}</label>
              <select
                {...register('betType', { required: true })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {betTypeOptions.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t('addBet.bookmaker')} <span className="text-slate-400">({t('addBet.optional')})</span>
              </label>
              <select
                {...register('bookmakerId')}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="">{t('addBet.none')}</option>
                {bookmakers.map((bk) => (
                  <option key={bk.id} value={bk.id}>{bk.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('addBet.notes')} <span className="text-slate-400">({t('addBet.optional')})</span>
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder={t('addBet.notesPlaceholder')}
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
              {t('addBet.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {isLoading ? t('addBet.saving') : t('addBet.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
