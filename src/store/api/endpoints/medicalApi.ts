import { api } from '../baseApi';
import type { ApiResponse, PagedData, MedicalProfile, Disease, ElderlyDisease, VitalSign } from '../../../types';

export const medicalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalProfile: builder.query<ApiResponse<MedicalProfile>, number>({
      query: (elderlyId) => ({ url: `/medical-profiles/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['MedicalProfile'],
    }),
    createMedicalProfile: builder.mutation<ApiResponse<MedicalProfile>, Partial<MedicalProfile>>({
      query: (body) => ({ url: '/medical-profiles', method: 'POST', data: body }),
      invalidatesTags: ['MedicalProfile'],
    }),
    updateMedicalProfile: builder.mutation<ApiResponse<MedicalProfile>, { id: number; body: Partial<MedicalProfile> }>({
      query: ({ id, body }) => ({ url: `/medical-profiles/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['MedicalProfile'],
    }),

    getDiseases: builder.query<ApiResponse<PagedData<Disease>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/diseases?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['Disease'],
    }),
    createDisease: builder.mutation<ApiResponse<Disease>, Partial<Disease>>({
      query: (body) => ({ url: '/diseases', method: 'POST', data: body }),
      invalidatesTags: ['Disease'],
    }),
    updateDisease: builder.mutation<ApiResponse<Disease>, { id: number; body: Partial<Disease> }>({
      query: ({ id, body }) => ({ url: `/diseases/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Disease'],
    }),
    deleteDisease: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/diseases/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Disease'],
    }),

    getElderlyDiseases: builder.query<ApiResponse<ElderlyDisease[]>, number>({
      query: (elderlyId) => ({ url: `/elderly-diseases/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['ElderlyDisease'],
    }),
    createElderlyDisease: builder.mutation<ApiResponse<ElderlyDisease>, Partial<ElderlyDisease>>({
      query: (body) => ({ url: '/elderly-diseases', method: 'POST', data: body }),
      invalidatesTags: ['ElderlyDisease'],
    }),
    deleteElderlyDisease: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/elderly-diseases/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ElderlyDisease'],
    }),

    getVitalSigns: builder.query<ApiResponse<VitalSign[]>, number>({
      query: (elderlyId) => ({ url: `/vital-signs/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['VitalSign'],
    }),
    createVitalSign: builder.mutation<ApiResponse<VitalSign>, Partial<VitalSign>>({
      query: (body) => ({ url: '/vital-signs', method: 'POST', data: body }),
      invalidatesTags: ['VitalSign'],
    }),
    updateVitalSign: builder.mutation<ApiResponse<VitalSign>, { id: number; body: Partial<VitalSign> }>({
      query: ({ id, body }) => ({ url: `/vital-signs/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['VitalSign'],
    }),
    deleteVitalSign: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/vital-signs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['VitalSign'],
    }),
  }),
});

export const {
  useGetMedicalProfileQuery, useCreateMedicalProfileMutation, useUpdateMedicalProfileMutation,
  useGetDiseasesQuery, useCreateDiseaseMutation, useUpdateDiseaseMutation, useDeleteDiseaseMutation,
  useGetElderlyDiseasesQuery, useCreateElderlyDiseaseMutation, useDeleteElderlyDiseaseMutation,
  useGetVitalSignsQuery, useCreateVitalSignMutation, useUpdateVitalSignMutation, useDeleteVitalSignMutation,
} = medicalApi;
