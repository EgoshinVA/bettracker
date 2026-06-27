import { useGetUserPreferencesQuery } from '@/shared/api/user-preferences.api'
import { useGetExchangeRatesQuery } from '@/shared/api/exchange-rates.api'

export interface CurrencyContext {
  /** Symbol of user's selected currency (e.g. "₽", "$") */
  symbol: string
  /** ISO code of user's selected currency (e.g. "RUB", "USD") */
  code: string
  /** Units of user's currency per 1 USD (e.g. RUB = 90) */
  rate: number
  /** USD amount → user's currency amount */
  toDisplay: (usdAmount: number) => number
  /** User's currency amount → USD amount for storage */
  toUsd: (displayAmount: number) => number
  /** Format USD amount as localised string with currency symbol */
  format: (usdAmount: number, decimals?: number) => string
  isLoading: boolean
}

export function useCurrency(): CurrencyContext {
  const { data: prefs, isLoading: prefsLoading } = useGetUserPreferencesQuery()
  const { data: rates = [], isLoading: ratesLoading } = useGetExchangeRatesQuery()

  const code = prefs?.currency?.code ?? 'USD'
  const symbol = prefs?.currency?.symbol ?? '$'
  const rate = rates.find((r) => r.currencyCode === code)?.usdRate ?? 1

  const toDisplay = (usdAmount: number) => usdAmount * rate
  const toUsd = (displayAmount: number) => displayAmount / rate

  const format = (usdAmount: number, decimals = 2) => {
    const amount = toDisplay(usdAmount)
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`
  }

  return { symbol, code, rate, toDisplay, toUsd, format, isLoading: prefsLoading || ratesLoading }
}
