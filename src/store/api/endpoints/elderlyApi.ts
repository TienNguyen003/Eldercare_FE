import { api } from '../baseApi';
import type { ApiResponse, PagedData, Elderly, ElderlyProfile, EmergencyContact, Document } from '../../../types';

export const elderlyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getElderlies: builder.query<ApiResponse<PagedData<Elderly>>, { page?: number; size?: number; q?: string }>({
      query: ({ page = 0, size = 20, q } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (q) params.set('fullName', q);
        return { url: `/elderly?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Elderly'],
    }),
    getElderlyById: builder.query<ApiResponse<Elderly>, number>({
      query: (id) => ({ url: `/elderly/${id}`, method: 'GET' }),
      providesTags: ['Elderly'],
    }),
    getMyFamilyElderlies: builder.query<ApiResponse<Elderly[]>, void>({
      query: () => ({ url: '/elderly/my-family', method: 'GET' }),
      providesTags: ['Elderly'],
    }),
    createElderly: builder.mutation<ApiResponse<Elderly>, Partial<Elderly>>({
      query: (body) => ({ url: '/elderly', method: 'POST', data: body }),
      invalidatesTags: ['Elderly'],
    }),
    updateElderly: builder.mutation<ApiResponse<Elderly>, { id: number; body: Partial<Elderly> }>({
      query: ({ id, body }) => ({ url: `/elderly/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Elderly'],
    }),
    deleteElderly: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/elderly/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Elderly'],
    }),

    getElderlyProfile: builder.query<ApiResponse<ElderlyProfile>, number>({
      query: (elderlyId) => ({ url: `/elderly-profiles/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['ElderlyProfile'],
    }),
    createElderlyProfile: builder.mutation<ApiResponse<ElderlyProfile>, Partial<ElderlyProfile>>({
      query: (body) => ({ url: '/elderly-profiles', method: 'POST', data: body }),
      invalidatesTags: ['ElderlyProfile'],
    }),
    updateElderlyProfile: builder.mutation<ApiResponse<ElderlyProfile>, { id: number; body: Partial<ElderlyProfile> }>({
      query: ({ id, body }) => ({ url: `/elderly-profiles/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['ElderlyProfile'],
    }),

    getEmergencyContacts: builder.query<ApiResponse<EmergencyContact[]>, number>({
      query: (elderlyId) => ({ url: `/emergency-contacts/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['EmergencyContact'],
    }),
    createEmergencyContact: builder.mutation<ApiResponse<EmergencyContact>, Partial<EmergencyContact>>({
      query: (body) => ({ url: '/emergency-contacts', method: 'POST', data: body }),
      invalidatesTags: ['EmergencyContact'],
    }),
    updateEmergencyContact: builder.mutation<ApiResponse<EmergencyContact>, { id: number; body: Partial<EmergencyContact> }>({
      query: ({ id, body }) => ({ url: `/emergency-contacts/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['EmergencyContact'],
    }),
    deleteEmergencyContact: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/emergency-contacts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['EmergencyContact'],
    }),

    getDocuments: builder.query<ApiResponse<PagedData<Document>>, { page?: number; size?: number; title?: string; type?: string }>({
      query: ({ page = 0, size = 20, title, type } = {}) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (title) params.set('fileName', title);
        if (type) params.set('type', type);
        return { url: `/documents?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Document'],
    }),
    getDocumentsByElderly: builder.query<ApiResponse<Document[]>, number>({
      query: (elderlyId) => ({ url: `/documents/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['Document'],
    }),
    createDocument: builder.mutation<ApiResponse<Document>, Partial<Document>>({
      query: (body) => ({ url: '/documents', method: 'POST', data: body }),
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetElderliesQuery, useGetElderlyByIdQuery, useGetMyFamilyElderliesQuery, useCreateElderlyMutation, useUpdateElderlyMutation, useDeleteElderlyMutation,
  useGetElderlyProfileQuery, useCreateElderlyProfileMutation, useUpdateElderlyProfileMutation,
  useGetEmergencyContactsQuery, useCreateEmergencyContactMutation, useUpdateEmergencyContactMutation, useDeleteEmergencyContactMutation,
  useGetDocumentsQuery, useGetDocumentsByElderlyQuery, useCreateDocumentMutation, useDeleteDocumentMutation,
} = elderlyApi;
