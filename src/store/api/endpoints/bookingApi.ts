import { api } from '../baseApi';
import type { ApiResponse, PagedData, ServiceBooking } from '../../../types';

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public: gui yeu cau dat dich vu tu website
    createServiceBooking: builder.mutation<ApiResponse<ServiceBooking>, Partial<ServiceBooking>>({
      query: (body) => ({ url: '/service-bookings', method: 'POST', data: body }),
    }),
    // Admin: quan ly yeu cau
    getServiceBookings: builder.query<ApiResponse<PagedData<ServiceBooking>>, { page?: number; size?: number; status?: string }>({
      query: ({ page = 0, size = 20, status } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (status) params.set('status', status);
        return { url: `/service-bookings?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['ServiceBooking'],
    }),
    getUnprocessedBookings: builder.query<ApiResponse<ServiceBooking[]>, void>({
      query: () => ({ url: '/service-bookings/unprocessed', method: 'GET' }),
      providesTags: ['ServiceBooking'],
    }),
    updateBookingStatus: builder.mutation<ApiResponse<ServiceBooking>, { id: number; status: string }>({
      query: ({ id, status }) => ({ url: `/service-bookings/${id}/status`, method: 'PATCH', data: { status } }),
      invalidatesTags: ['ServiceBooking'],
    }),
    deleteServiceBooking: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/service-bookings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ServiceBooking'],
    }),
  }),
});

export const {
  useCreateServiceBookingMutation, useGetServiceBookingsQuery, useGetUnprocessedBookingsQuery,
  useUpdateBookingStatusMutation, useDeleteServiceBookingMutation,
} = bookingApi;
