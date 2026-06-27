import { baseApi } from '@/shared/api/baseApi'

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
    getUserPreferences: build.query<UserPreferences, void>({
      query: () => '/preferences/me',
      providesTags: ['UserPreferences'],
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
  useGetUserPreferencesQuery,
  useUpdateCurrencyMutation,
  useUpdateTimezoneMutation,
  useUpdateLanguageMutation,
} = preferencesApi
