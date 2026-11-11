import { api } from '../baseApi';
import type { ApiResponse, PagedData, Feedback } from '../../../types';

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public: hien thi danh gia (ServicesPage) - loc theo caregiverId neu co
    getFeedbacks: builder.query<ApiResponse<PagedData<Feedback>>, { page?: number; size?: number; caregiverId?: number }>({
      query: ({ page = 0, size = 20, caregiverId } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (caregiverId) params.set('caregiverId', String(caregiverId));
        return { url: `/feedbacks?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Feedback'],
    }),
    // Public: khach hang / gia dinh gui danh gia
    createFeedback: builder.mutation<ApiResponse<Feedback>, Partial<Feedback>>({
      query: (body) => ({ url: '/feedbacks', method: 'POST', data: body }),
      invalidatesTags: ['Feedback', 'Caregiver'],
    }),
    // Admin: xoa danh gia khong phu hop
    deleteFeedback: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/feedbacks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Feedback', 'Caregiver'],
    }),
  }),
});

export const {
  useGetFeedbacksQuery, useCreateFeedbackMutation, useDeleteFeedbackMutation,
} = feedbackApi;
