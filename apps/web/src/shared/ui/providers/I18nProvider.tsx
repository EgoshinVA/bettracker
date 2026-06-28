'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import i18n from '@/shared/lib/i18n/config'
import { useGetUserPreferencesQuery } from '@/shared/api/user-preferences.api'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const { data: prefs } = useGetUserPreferencesQuery(undefined, {
    skip: status !== 'authenticated',
  })

  useEffect(() => {
    const code = prefs?.language?.code
    if (code && i18n.language !== code) {
      void i18n.changeLanguage(code)
    }
  }, [prefs?.language?.code])

  return <>{children}</>
}
