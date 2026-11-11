import { api } from '../baseApi';
import type { ApiResponse, Notification } from '../../../types';

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<Notification[]>, number>({
      query: (userId) => ({ url: `/notifications/user/${userId}`, method: 'GET' }),
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<ApiResponse<number>, number>({
      query: (userId) => ({ url: `/notifications/user/${userId}/unread/count`, method: 'GET' }),
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery, useGetUnreadCountQuery,
  useMarkNotificationReadMutation, useDeleteNotificationMutation,
} = notificationApi;
