import { baseApi } from '@/shared/api/baseApi'
import type { Bookmaker, BookmakerStats, CreateBookmakerRequest, UpdateBookmakerRequest } from '@bettracker/shared'

export const bookmakersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBookmakers: build.query<Bookmaker[], void>({
      query: () => '/bookmakers',
      providesTags: ['Bookmakers'],
    }),
    getBookmakerStats: build.query<BookmakerStats[], void>({
      query: () => '/bookmakers/stats',
      providesTags: ['BookmakerStats'],
    }),
    createBookmaker: build.mutation<Bookmaker, CreateBookmakerRequest>({
      query: (body) => ({ url: '/bookmakers', method: 'POST', body }),
      invalidatesTags: ['Bookmakers', 'BookmakerStats'],
    }),
    updateBookmaker: build.mutation<Bookmaker, { id: string } & UpdateBookmakerRequest>({
      query: ({ id, ...body }) => ({ url: `/bookmakers/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Bookmakers', 'BookmakerStats'],
    }),
    deleteBookmaker: build.mutation<void, string>({
      query: (id) => ({ url: `/bookmakers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Bookmakers', 'BookmakerStats'],
    }),
  }),
})

export const {
  useGetBookmakersQuery,
  useGetBookmakerStatsQuery,
  useCreateBookmakerMutation,
  useUpdateBookmakerMutation,
  useDeleteBookmakerMutation,
} = bookmakersApi
