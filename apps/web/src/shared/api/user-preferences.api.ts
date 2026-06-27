import { baseApi } from './baseApi'

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

const userPreferencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserPreferences: build.query<UserPreferences, void>({
      query: () => '/preferences/me',
      providesTags: ['UserPreferences'],
    }),
  }),
})

export const { useGetUserPreferencesQuery } = userPreferencesApi
