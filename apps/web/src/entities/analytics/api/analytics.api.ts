import { baseApi } from '@/shared/api/baseApi'
import type { AnalyticsOverview } from '@bettracker/shared'

export type Period = '7D' | '30D' | '90D' | 'YTD'

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalyticsOverview: build.query<AnalyticsOverview, Period>({
      query: (period) => `/analytics/overview?period=${period}`,
      providesTags: ['Analytics'],
    }),
  }),
})

export const { useGetAnalyticsOverviewQuery } = analyticsApi
