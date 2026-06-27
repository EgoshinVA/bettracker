'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { FormSkeleton } from '@/shared/ui/FormSkeleton'
import {
  getCurrencies,
  getTimezones,
  getLanguages,
  getUserPreferences,
  updateCurrency,
  updateTimezone,
  updateLanguage,
  type Currency,
  type Timezone,
  type Language,
} from '../api/preferences.api'

const selectClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400'

export function AppPreferencesForm() {
  const { data: session } = useSession()

  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])
  const [languages, setLanguages] = useState<Language[]>([])

  const [currencyId, setCurrencyId] = useState('')
  const [timezoneId, setTimezoneId] = useState('')
  const [languageId, setLanguageId] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<'currency' | 'timezone' | 'language' | null>(null)

  useEffect(() => {
    if (!session?.accessToken) return

    Promise.all([
      getCurrencies(),
      getTimezones(),
      getLanguages(),
      getUserPreferences(session.accessToken),
    ])
      .then(([cur, tz, lang, prefs]) => {
        setCurrencies(cur)
        setTimezones(tz)
        setLanguages(lang)
        setCurrencyId(prefs.currencyId ?? '')
        setTimezoneId(prefs.timezoneId ?? '')
        setLanguageId(prefs.languageId ?? '')
      })
      .catch(() => toast.error('Failed to load preferences'))
      .finally(() => setLoading(false))
  }, [session?.accessToken])

  const handleCurrency = async (id: string) => {
    setCurrencyId(id)
    setSaving('currency')
    try {
      await updateCurrency(id, session!.accessToken)
      toast.success('Currency updated')
    } catch {
      toast.error('Failed to update currency')
    } finally {
      setSaving(null)
    }
  }

  const handleTimezone = async (id: string) => {
    setTimezoneId(id)
    setSaving('timezone')
    try {
      await updateTimezone(id, session!.accessToken)
      toast.success('Timezone updated')
    } catch {
      toast.error('Failed to update timezone')
    } finally {
      setSaving(null)
    }
  }

  const handleLanguage = async (id: string) => {
    setLanguageId(id)
    setSaving('language')
    try {
      await updateLanguage(id, session!.accessToken)
      toast.success('Language updated')
    } catch {
      toast.error('Failed to update language')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <FormSkeleton cols={3} />

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className={labelClass}>Currency</label>
        <select
          value={currencyId}
          onChange={(e) => handleCurrency(e.target.value)}
          disabled={saving === 'currency'}
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
        <label className={labelClass}>Timezone</label>
        <select
          value={timezoneId}
          onChange={(e) => handleTimezone(e.target.value)}
          disabled={saving === 'timezone'}
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
        <label className={labelClass}>Language</label>
        <select
          value={languageId}
          onChange={(e) => handleLanguage(e.target.value)}
          disabled={saving === 'language'}
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
