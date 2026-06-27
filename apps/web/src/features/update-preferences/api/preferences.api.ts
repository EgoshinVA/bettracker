const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
}

export interface Timezone {
  id: string
  code: string
  name: string
  offset: string
}

export interface Language {
  id: string
  code: string
  name: string
  nativeName: string
}

export interface UserPreferences {
  id: string
  currencyId: string | null
  timezoneId: string | null
  languageId: string | null
  currency: Currency | null
  timezone: Timezone | null
  language: Language | null
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return res.json()
}

async function patch<T>(path: string, body: object, accessToken: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? 'Request failed')
  }
  return res.json()
}

export const getCurrencies = (): Promise<Currency[]> => get('/preferences/currencies')
export const getTimezones = (): Promise<Timezone[]> => get('/preferences/timezones')
export const getLanguages = (): Promise<Language[]> => get('/preferences/languages')
export const getUserPreferences = (token: string): Promise<UserPreferences> =>
  fetch(`${API_URL}/api/preferences/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json())

export const updateCurrency = (currencyId: string, token: string) =>
  patch('/preferences/me/currency', { currencyId }, token)

export const updateTimezone = (timezoneId: string, token: string) =>
  patch('/preferences/me/timezone', { timezoneId }, token)

export const updateLanguage = (languageId: string, token: string) =>
  patch('/preferences/me/language', { languageId }, token)
