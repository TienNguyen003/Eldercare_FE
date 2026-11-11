import { api } from '../baseApi';
import type { ApiResponse, FunctionalAssessment, MentalHealthAssessment } from '../../../types';

export const assessmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFunctionalAssessments: builder.query<ApiResponse<FunctionalAssessment[]>, number>({
      query: (elderlyId) => ({ url: `/functional-assessments/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['FunctionalAssessment'],
    }),
    createFunctionalAssessment: builder.mutation<ApiResponse<FunctionalAssessment>, Partial<FunctionalAssessment>>({
      query: (body) => ({ url: '/functional-assessments', method: 'POST', data: body }),
      invalidatesTags: ['FunctionalAssessment'],
    }),

    getMentalHealthAssessments: builder.query<ApiResponse<MentalHealthAssessment[]>, number>({
      query: (elderlyId) => ({ url: `/mental-health-assessments/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['MentalHealthAssessment'],
    }),
    createMentalHealthAssessment: builder.mutation<ApiResponse<MentalHealthAssessment>, Partial<MentalHealthAssessment>>({
      query: (body) => ({ url: '/mental-health-assessments', method: 'POST', data: body }),
      invalidatesTags: ['MentalHealthAssessment'],
    }),
  }),
});

export const {
  useGetFunctionalAssessmentsQuery, useCreateFunctionalAssessmentMutation,
  useGetMentalHealthAssessmentsQuery, useCreateMentalHealthAssessmentMutation,
} = assessmentApi;
