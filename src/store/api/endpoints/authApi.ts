import { api } from '../baseApi';
import type { ApiResponse, User, ChangePasswordRequest } from '../../../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>, { username: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
    }),
    register: builder.mutation<ApiResponse<any>, { username: string; password: string; email: string; phone?: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', data: body }),
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      providesTags: ['User'],
    }),
    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', data: body }),
    }),
    updateProfile: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>, Partial<User>>({
      query: (body) => ({ url: '/auth/profile', method: 'PUT', data: body }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useChangePasswordMutation, useUpdateProfileMutation } = authApi;
