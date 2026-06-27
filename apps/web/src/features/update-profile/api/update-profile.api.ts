import { baseApi } from '@/shared/api/baseApi'

export interface UpdateProfileData {
  name?: string
  email?: string
}

export interface UpdateProfileResult {
  id: string
  name: string
  email: string
}

export const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation<UpdateProfileResult, UpdateProfileData>({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
})

export const { useUpdateProfileMutation } = updateProfileApi
