import { api } from '../baseApi';
import type { ApiResponse, PagedData, IncidentReport } from '../../../types';

export const incidentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentReports: builder.query<ApiResponse<PagedData<IncidentReport>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/incident-reports?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['IncidentReport'],
    }),
    getIncidentReportsByElderly: builder.query<ApiResponse<IncidentReport[]>, number>({
      query: (elderlyId) => ({ url: `/incident-reports/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['IncidentReport'],
    }),
    createIncidentReport: builder.mutation<ApiResponse<IncidentReport>, Partial<IncidentReport>>({
      query: (body) => ({ url: '/incident-reports', method: 'POST', data: body }),
      invalidatesTags: ['IncidentReport'],
    }),
    updateIncidentReport: builder.mutation<ApiResponse<IncidentReport>, { id: number; body: Partial<IncidentReport> }>({
      query: ({ id, body }) => ({ url: `/incident-reports/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['IncidentReport'],
    }),
  }),
});

export const {
  useGetIncidentReportsQuery, useGetIncidentReportsByElderlyQuery,
  useCreateIncidentReportMutation, useUpdateIncidentReportMutation,
} = incidentApi;
