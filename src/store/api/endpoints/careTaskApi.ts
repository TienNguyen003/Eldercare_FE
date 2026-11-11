import { api } from '../baseApi';
import type { ApiResponse, PagedData, CareTask } from '../../../types';

export const careTaskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCareTasks: builder.query<ApiResponse<PagedData<CareTask>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/care-tasks?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['CareTask'],
    }),
    getCareTasksBySchedule: builder.query<ApiResponse<CareTask[]>, number>({
      query: (scheduleId) => ({ url: `/care-tasks/schedule/${scheduleId}`, method: 'GET' }),
      providesTags: ['CareTask'],
    }),
    getCareTaskById: builder.query<ApiResponse<CareTask>, number>({
      query: (id) => ({ url: `/care-tasks/${id}`, method: 'GET' }),
      providesTags: ['CareTask'],
    }),
    createCareTask: builder.mutation<ApiResponse<CareTask>, Partial<CareTask>>({
      query: (body) => ({ url: '/care-tasks', method: 'POST', data: body }),
      invalidatesTags: ['CareTask'],
    }),
    updateCareTask: builder.mutation<ApiResponse<CareTask>, { id: number; body: Partial<CareTask> }>({
      query: ({ id, body }) => ({ url: `/care-tasks/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['CareTask'],
    }),
    deleteCareTask: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/care-tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CareTask'],
    }),
  }),
});

export const {
  useGetCareTasksQuery,
  useGetCareTasksByScheduleQuery,
  useGetCareTaskByIdQuery,
  useCreateCareTaskMutation,
  useUpdateCareTaskMutation,
  useDeleteCareTaskMutation,
} = careTaskApi;
