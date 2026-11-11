import { api } from '../baseApi';
import type { ApiResponse, ContactMessage } from '../../../types';

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation<ApiResponse<ContactMessage>, { name: string; email: string; phone?: string; message: string }>({
      query: (body) => ({ url: '/contact-messages', method: 'POST', data: body }),
      invalidatesTags: ['ContactMessage'],
    }),
    getContactMessages: builder.query<ApiResponse<ContactMessage[]>, void>({
      query: () => ({ url: '/contact-messages', method: 'GET' }),
      providesTags: ['ContactMessage'],
    }),
    markContactMessageProcessed: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/contact-messages/${id}/processed`, method: 'PATCH' }),
      invalidatesTags: ['ContactMessage'],
    }),
    deleteContactMessage: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/contact-messages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ContactMessage'],
    }),
  }),
});

export const {
  useSubmitContactMessageMutation, useGetContactMessagesQuery,
  useMarkContactMessageProcessedMutation, useDeleteContactMessageMutation,
} = contactApi;