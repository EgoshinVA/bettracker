import { baseApi } from './baseApi'
import type { ExchangeRate } from '@bettracker/shared'

const exchangeRatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExchangeRates: build.query<ExchangeRate[], void>({
      query: () => '/exchange-rates',
      providesTags: ['ExchangeRates'],
    }),
  }),
})

export const { useGetExchangeRatesQuery } = exchangeRatesApi
