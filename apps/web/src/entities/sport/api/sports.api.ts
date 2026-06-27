import { baseApi } from '@/shared/api/baseApi'
import type { Sport } from '@bettracker/shared'

export const sportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSports: build.query<Sport[], void>({
      query: () => '/sports',
      providesTags: ['Sports'],
    }),
  }),
})

export const { useGetSportsQuery } = sportsApi
