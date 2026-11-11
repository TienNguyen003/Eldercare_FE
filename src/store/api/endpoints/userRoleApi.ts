import { api } from '../baseApi';
import type { ApiResponse, UserRole } from '../../../types';

export const userRoleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserRoles: builder.query<ApiResponse<UserRole[]>, number>({
      query: (userId) => ({ url: `/user-roles/user/${userId}`, method: 'GET' }),
      providesTags: ['UserRole'],
    }),
    assignUserRole: builder.mutation<ApiResponse<UserRole>, { userId: number; roleId: number }>({
      query: ({ userId, roleId }) => ({ url: '/user-roles', method: 'POST', data: { userId, roleId } }),
      invalidatesTags: ['UserRole'],
    }),
    revokeUserRole: builder.mutation<ApiResponse<void>, { userId: number; roleId: number }>({
      query: ({ userId, roleId }) => ({ url: `/user-roles/user/${userId}/role/${roleId}`, method: 'DELETE' }),
      invalidatesTags: ['UserRole'],
    }),
  }),
});

export const {
  useGetUserRolesQuery,
  useAssignUserRoleMutation,
  useRevokeUserRoleMutation,
} = userRoleApi;
