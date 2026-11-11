import { api } from '../baseApi';
import type { ApiResponse, PagedData, Caregiver, CarePlan, CareSchedule } from '../../../types';

export const careApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCaregivers: builder.query<ApiResponse<PagedData<Caregiver>>, { page?: number; size?: number; q?: string }>({
      query: ({ page = 0, size = 20, q } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (q) params.set('fullName', q);
        return { url: `/caregivers?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Caregiver'],
    }),
    getCaregiverById: builder.query<ApiResponse<Caregiver>, number>({
      query: (id) => ({ url: `/caregivers/${id}`, method: 'GET' }),
      providesTags: ['Caregiver'],
    }),
    getCaregiverByUserId: builder.query<ApiResponse<Caregiver>, number>({
      query: (userId) => ({ url: `/caregivers/user/${userId}`, method: 'GET' }),
      providesTags: ['Caregiver'],
    }),
    createCaregiver: builder.mutation<ApiResponse<Caregiver>, Partial<Caregiver>>({
      query: (body) => ({ url: '/caregivers', method: 'POST', data: body }),
      invalidatesTags: ['Caregiver'],
    }),
    updateCaregiver: builder.mutation<ApiResponse<Caregiver>, { id: number; body: Partial<Caregiver> }>({
      query: ({ id, body }) => ({ url: `/caregivers/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Caregiver'],
    }),
    deleteCaregiver: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/caregivers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Caregiver'],
    }),

    getCarePlans: builder.query<ApiResponse<PagedData<CarePlan>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/care-plans?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['CarePlan'],
    }),
    getCarePlansByElderly: builder.query<ApiResponse<CarePlan[]>, number>({
      query: (elderlyId) => ({ url: `/care-plans/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['CarePlan'],
    }),
    createCarePlan: builder.mutation<ApiResponse<CarePlan>, Partial<CarePlan>>({
      query: (body) => ({ url: '/care-plans', method: 'POST', data: body }),
      invalidatesTags: ['CarePlan'],
    }),
    updateCarePlan: builder.mutation<ApiResponse<CarePlan>, { id: number; body: Partial<CarePlan> }>({
      query: ({ id, body }) => ({ url: `/care-plans/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['CarePlan'],
    }),
    deleteCarePlan: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/care-plans/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CarePlan'],
    }),

    getCareSchedules: builder.query<ApiResponse<PagedData<CareSchedule>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/care-schedules?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['CareSchedule'],
    }),
    getCareSchedulesByElderly: builder.query<ApiResponse<CareSchedule[]>, number>({
      query: (elderlyId) => ({ url: `/care-schedules/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['CareSchedule'],
    }),
    getCareSchedulesByCaregiver: builder.query<ApiResponse<CareSchedule[]>, number>({
      query: (caregiverId) => ({ url: `/care-schedules/caregiver/${caregiverId}`, method: 'GET' }),
      providesTags: ['CareSchedule'],
    }),
    createCareSchedule: builder.mutation<ApiResponse<CareSchedule>, Partial<CareSchedule>>({
      query: (body) => ({ url: '/care-schedules', method: 'POST', data: body }),
      invalidatesTags: ['CareSchedule'],
    }),
    updateCareSchedule: builder.mutation<ApiResponse<CareSchedule>, { id: number; body: Partial<CareSchedule> }>({
      query: ({ id, body }) => ({ url: `/care-schedules/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['CareSchedule'],
    }),
    deleteCareSchedule: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/care-schedules/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CareSchedule'],
    }),
    checkInSchedule: builder.mutation<ApiResponse<CareSchedule>, number>({
      query: (id) => ({ url: `/care-schedules/${id}/check-in`, method: 'PATCH' }),
      invalidatesTags: ['CareSchedule'],
    }),
    checkOutSchedule: builder.mutation<ApiResponse<CareSchedule>, number>({
      query: (id) => ({ url: `/care-schedules/${id}/check-out`, method: 'PATCH' }),
      invalidatesTags: ['CareSchedule'],
    }),
  }),
});

export const {
  useGetCaregiversQuery, useGetCaregiverByIdQuery, useGetCaregiverByUserIdQuery, useCreateCaregiverMutation, useUpdateCaregiverMutation, useDeleteCaregiverMutation,
  useGetCarePlansQuery, useGetCarePlansByElderlyQuery, useCreateCarePlanMutation, useUpdateCarePlanMutation, useDeleteCarePlanMutation,
  useGetCareSchedulesQuery, useGetCareSchedulesByElderlyQuery, useGetCareSchedulesByCaregiverQuery, useCreateCareScheduleMutation, useUpdateCareScheduleMutation, useDeleteCareScheduleMutation,
  useCheckInScheduleMutation, useCheckOutScheduleMutation,
} = careApi;
