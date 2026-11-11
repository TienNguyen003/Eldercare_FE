import { api } from '../baseApi';
import type { ApiResponse, PagedData, Medication, MedicationSchedule, Prescription } from '../../../types';

export const medicationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedications: builder.query<ApiResponse<PagedData<Medication>>, { page?: number; size?: number; q?: string }>({
      query: ({ page = 0, size = 20, q } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (q) params.set('name', q);
        return { url: `/medications?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Medication'],
    }),
    createMedication: builder.mutation<ApiResponse<Medication>, Partial<Medication>>({
      query: (body) => ({ url: '/medications', method: 'POST', data: body }),
      invalidatesTags: ['Medication'],
    }),
    updateMedication: builder.mutation<ApiResponse<Medication>, { id: number; body: Partial<Medication> }>({
      query: ({ id, body }) => ({ url: `/medications/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Medication'],
    }),
    deleteMedication: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/medications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Medication'],
    }),

    getMedicationSchedulesByElderly: builder.query<ApiResponse<MedicationSchedule[]>, number>({
      query: (elderlyId) => ({ url: `/medication-schedules/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['MedicationSchedule'],
    }),
    createMedicationSchedule: builder.mutation<ApiResponse<MedicationSchedule>, Partial<MedicationSchedule>>({
      query: (body) => ({ url: '/medication-schedules', method: 'POST', data: body }),
      invalidatesTags: ['MedicationSchedule'],
    }),
    updateMedicationSchedule: builder.mutation<ApiResponse<MedicationSchedule>, { id: number; body: Partial<MedicationSchedule> }>({
      query: ({ id, body }) => ({ url: `/medication-schedules/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['MedicationSchedule'],
    }),
    deleteMedicationSchedule: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/medication-schedules/${id}`, method: 'DELETE' }),
      invalidatesTags: ['MedicationSchedule'],
    }),
    markMedicationTaken: builder.mutation<ApiResponse<MedicationSchedule>, number>({
      query: (id) => ({ url: `/medication-schedules/${id}/taken`, method: 'PATCH' }),
      invalidatesTags: ['MedicationSchedule'],
    }),
    markMedicationMissed: builder.mutation<ApiResponse<MedicationSchedule>, number>({
      query: (id) => ({ url: `/medication-schedules/${id}/missed`, method: 'PATCH' }),
      invalidatesTags: ['MedicationSchedule'],
    }),

    getPrescriptionsByElderly: builder.query<ApiResponse<Prescription[]>, number>({
      query: (elderlyId) => ({ url: `/prescriptions/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['Prescription'],
    }),
    createPrescription: builder.mutation<ApiResponse<Prescription>, Partial<Prescription>>({
      query: (body) => ({ url: '/prescriptions', method: 'POST', data: body }),
      invalidatesTags: ['Prescription'],
    }),
    updatePrescription: builder.mutation<ApiResponse<Prescription>, { id: number; body: Partial<Prescription> }>({
      query: ({ id, body }) => ({ url: `/prescriptions/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Prescription'],
    }),
    deletePrescription: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/prescriptions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Prescription'],
    }),
  }),
});

export const {
  useGetMedicationsQuery, useCreateMedicationMutation, useUpdateMedicationMutation, useDeleteMedicationMutation,
  useGetMedicationSchedulesByElderlyQuery, useCreateMedicationScheduleMutation, useUpdateMedicationScheduleMutation, useDeleteMedicationScheduleMutation,
  useMarkMedicationTakenMutation, useMarkMedicationMissedMutation,
  useGetPrescriptionsByElderlyQuery, useCreatePrescriptionMutation, useUpdatePrescriptionMutation, useDeletePrescriptionMutation,
} = medicationApi;
