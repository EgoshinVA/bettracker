import { baseApi } from '@/shared/api/baseApi'
import type { Currency, Timezone, Language, UserPreferences } from '@/shared/api/user-preferences.api'

export type { Currency, Timezone, Language, UserPreferences } from '@/shared/api/user-preferences.api'
export { useGetUserPreferencesQuery } from '@/shared/api/user-preferences.api'

export const preferencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrencies: build.query<Currency[], void>({
      query: () => '/preferences/currencies',
    }),
    getTimezones: build.query<Timezone[], void>({
      query: () => '/preferences/timezones',
    }),
    getLanguages: build.query<Language[], void>({
      query: () => '/preferences/languages',
    }),
    updateCurrency: build.mutation<UserPreferences, string>({
      query: (currencyId) => ({ url: '/preferences/me/currency', method: 'PATCH', body: { currencyId } }),
      invalidatesTags: ['UserPreferences'],
    }),
    updateTimezone: build.mutation<UserPreferences, string>({
      query: (timezoneId) => ({ url: '/preferences/me/timezone', method: 'PATCH', body: { timezoneId } }),
      invalidatesTags: ['UserPreferences'],
    }),
    updateLanguage: build.mutation<UserPreferences, string>({
      query: (languageId) => ({ url: '/preferences/me/language', method: 'PATCH', body: { languageId } }),
      invalidatesTags: ['UserPreferences'],
    }),
  }),
})

export const {
  useGetCurrenciesQuery,
  useGetTimezonesQuery,
  useGetLanguagesQuery,
  useUpdateCurrencyMutation,
  useUpdateTimezoneMutation,
  useUpdateLanguageMutation,
} = preferencesApi
