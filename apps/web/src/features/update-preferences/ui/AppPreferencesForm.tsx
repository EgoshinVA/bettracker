'use client'

import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FormSkeleton } from '@/shared/ui/FormSkeleton'
import {
  useGetCurrenciesQuery,
  useGetTimezonesQuery,
  useGetLanguagesQuery,
  useGetUserPreferencesQuery,
  useUpdateCurrencyMutation,
  useUpdateTimezoneMutation,
  useUpdateLanguageMutation,
} from '../api/preferences.api'

const selectClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400'

export function AppPreferencesForm() {
  const { t } = useTranslation()
  const { data: currencies = [], isLoading: loadingCurrencies } = useGetCurrenciesQuery()
  const { data: timezones = [], isLoading: loadingTimezones } = useGetTimezonesQuery()
  const { data: languages = [], isLoading: loadingLanguages } = useGetLanguagesQuery()
  const { data: prefs, isLoading: loadingPrefs } = useGetUserPreferencesQuery()

  const [updateCurrency, { isLoading: savingCurrency }] = useUpdateCurrencyMutation()
  const [updateTimezone, { isLoading: savingTimezone }] = useUpdateTimezoneMutation()
  const [updateLanguage, { isLoading: savingLanguage }] = useUpdateLanguageMutation()

  const loading = loadingCurrencies || loadingTimezones || loadingLanguages || loadingPrefs

  const handleCurrency = async (id: string) => {
    try {
      await updateCurrency(id).unwrap()
      toast.success(t('preferences.currencyUpdated'))
    } catch {
      toast.error(t('preferences.failedCurrency'))
    }
  }

  const handleTimezone = async (id: string) => {
    try {
      await updateTimezone(id).unwrap()
      toast.success(t('preferences.timezoneUpdated'))
    } catch {
      toast.error(t('preferences.failedTimezone'))
    }
  }

  const handleLanguage = async (id: string) => {
    try {
      await updateLanguage(id).unwrap()
      toast.success(t('preferences.languageUpdated'))
    } catch {
      toast.error(t('preferences.failedLanguage'))
    }
  }

  if (loading) return <FormSkeleton cols={3} />

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className={labelClass}>{t('preferences.currency')}</label>
        <select
          value={prefs?.currencyId ?? ''}
          onChange={(e) => handleCurrency(e.target.value)}
          disabled={savingCurrency}
          className={selectClass}
        >
          {currencies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.symbol} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{t('preferences.timezone')}</label>
        <select
          value={prefs?.timezoneId ?? ''}
          onChange={(e) => handleTimezone(e.target.value)}
          disabled={savingTimezone}
          className={selectClass}
        >
          {timezones.map((tz) => (
            <option key={tz.id} value={tz.id}>
              (UTC{tz.offset}) {tz.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{t('preferences.language')}</label>
        <select
          value={prefs?.languageId ?? ''}
          onChange={(e) => handleLanguage(e.target.value)}
          disabled={savingLanguage}
          className={selectClass}
        >
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
