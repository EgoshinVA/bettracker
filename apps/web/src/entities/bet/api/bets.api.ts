import { baseApi } from '@/shared/api/baseApi'
import type { Bet, BetStats, CreateBetRequest, UpdateBetResultRequest } from '@bettracker/shared'

export const betsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBets: build.query<Bet[], void>({
      query: () => '/bets',
      providesTags: ['Bets'],
    }),
    getBetStats: build.query<BetStats, void>({
      query: () => '/bets/stats',
      providesTags: ['BetStats'],
    }),
    createBet: build.mutation<Bet, CreateBetRequest>({
      query: (body) => ({ url: '/bets', method: 'POST', body }),
      invalidatesTags: ['Bets', 'BetStats', 'Analytics'],
    }),
    updateBetResult: build.mutation<Bet, { id: string } & UpdateBetResultRequest>({
      query: ({ id, result }) => ({ url: `/bets/${id}`, method: 'PATCH', body: { result } }),
      invalidatesTags: ['Bets', 'BetStats', 'Analytics'],
    }),
    deleteBet: build.mutation<void, string>({
      query: (id) => ({ url: `/bets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Bets', 'BetStats', 'Analytics'],
    }),
  }),
})

export const {
  useGetBetsQuery,
  useGetBetStatsQuery,
  useCreateBetMutation,
  useUpdateBetResultMutation,
  useDeleteBetMutation,
} = betsApi
