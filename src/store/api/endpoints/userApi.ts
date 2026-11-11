import { api } from '../baseApi';
import type { ApiResponse, PagedData, User, Role, AuditLog } from '../../../types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PagedData<User>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/users?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({ url: '/users', method: 'POST', data: body }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: number; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    getRoles: builder.query<ApiResponse<PagedData<Role>>, void>({
      query: () => ({ url: '/roles?page=0&size=100', method: 'GET' }),
      providesTags: ['Role'],
    }),

    getAuditLogs: builder.query<ApiResponse<PagedData<AuditLog>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/audit-logs?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['AuditLog'],
    }),
  }),
});

export const {
  useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetRolesQuery,
  useGetAuditLogsQuery,
} = userApi;
