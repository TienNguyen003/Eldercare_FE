import { api } from '../baseApi';
import type { ApiResponse, DashboardStats, HealthAlert } from '../../../types';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => ({ url: '/dashboard/stats', method: 'GET' }),
      providesTags: ['Dashboard'],
    }),
    getHealthAlerts: builder.query<ApiResponse<HealthAlert[]>, void>({
      query: () => ({ url: '/dashboard/health-alerts', method: 'GET' }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetStatsQuery, useGetHealthAlertsQuery } = dashboardApi;