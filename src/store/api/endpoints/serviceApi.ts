import { api } from '../baseApi';
import type { ApiResponse, PagedData, ServicePackage, Payment } from '../../../types';

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServicePackages: builder.query<ApiResponse<PagedData<ServicePackage>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/service-packages?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['ServicePackage'],
    }),
    createServicePackage: builder.mutation<ApiResponse<ServicePackage>, Partial<ServicePackage>>({
      query: (body) => ({ url: '/service-packages', method: 'POST', data: body }),
      invalidatesTags: ['ServicePackage'],
    }),
    updateServicePackage: builder.mutation<ApiResponse<ServicePackage>, { id: number; body: Partial<ServicePackage> }>({
      query: ({ id, body }) => ({ url: `/service-packages/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['ServicePackage'],
    }),
    deleteServicePackage: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/service-packages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ServicePackage'],
    }),

    getPayments: builder.query<ApiResponse<PagedData<Payment>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/payments?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['Payment'],
    }),
    getPaymentsByElderly: builder.query<ApiResponse<Payment[]>, number>({
      query: (elderlyId) => ({ url: `/payments/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation<ApiResponse<Payment>, Partial<Payment>>({
      query: (body) => ({ url: '/payments', method: 'POST', data: body }),
      invalidatesTags: ['Payment'],
    }),
    updatePayment: builder.mutation<ApiResponse<Payment>, { id: number; body: Partial<Payment> }>({
      query: ({ id, body }) => ({ url: `/payments/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetServicePackagesQuery, useCreateServicePackageMutation, useUpdateServicePackageMutation, useDeleteServicePackageMutation,
  useGetPaymentsQuery, useGetPaymentsByElderlyQuery, useCreatePaymentMutation, useUpdatePaymentMutation,
} = serviceApi;
