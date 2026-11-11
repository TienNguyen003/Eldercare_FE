import { api } from '../baseApi';
import type { ApiResponse, PagedData, Role } from '../../../types';

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<ApiResponse<Role>, Partial<Role>>({
      query: (body) => ({ url: '/roles', method: 'POST', data: body }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<ApiResponse<Role>, { id: number; body: Partial<Role> }>({
      query: ({ id, body }) => ({ url: `/roles/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
