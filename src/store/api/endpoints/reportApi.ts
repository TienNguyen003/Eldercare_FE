import { api } from '../baseApi';
import type { ApiResponse, ReportOverview } from '../../../types';

export const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportOverview: builder.query<ApiResponse<ReportOverview>, void>({
      query: () => ({ url: '/reports/overview', method: 'GET' }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetReportOverviewQuery } = reportApi;