'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import i18n from '@/shared/lib/i18n/config'
import { useGetUserPreferencesQuery } from '@/shared/api/user-preferences.api'

const LANG_KEY = 'bt_lang'
const SUPPORTED = ['en', 'ru', 'fr', 'de', 'es', 'zh']

function resolveInitialLang(): string {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(LANG_KEY)
  if (stored && SUPPORTED.includes(stored)) return stored
  const browser = navigator.language.split('-')[0]
  return SUPPORTED.includes(browser) ? browser : 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const { data: prefs } = useGetUserPreferencesQuery(undefined, {
    skip: status !== 'authenticated',
  })

  useEffect(() => {
    const lang = resolveInitialLang()
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang)
    }
  }, [])

  useEffect(() => {
    const code = prefs?.language?.code
    if (code && SUPPORTED.includes(code)) {
      if (i18n.language !== code) {
        void i18n.changeLanguage(code)
      }
      localStorage.setItem(LANG_KEY, code)
    }
  }, [prefs?.language?.code])

  return <>{children}</>
}
