import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';
import type { ApiResponse, PagedData, Elderly, ElderlyProfile, MedicalProfile, Disease, ElderlyDisease, Document, EmergencyContact, VitalSign, Caregiver, CarePlan, CareSchedule, CareTask, Medication, MedicationSchedule, Prescription, FunctionalAssessment, MentalHealthAssessment, IncidentReport, ServicePackage, Payment, Notification, User, Role, AuditLog } from '../../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://10.1.1.79:2004/api' }),
  tagTypes: ['Elderly', 'ElderlyProfile', 'MedicalProfile', 'Disease', 'ElderlyDisease', 'Document', 'EmergencyContact', 'VitalSign', 'Caregiver', 'CarePlan', 'CareSchedule', 'CareTask', 'Medication', 'MedicationSchedule', 'Prescription', 'FunctionalAssessment', 'MentalHealthAssessment', 'IncidentReport', 'ServicePackage', 'Payment', 'Notification', 'User', 'Role', 'AuditLog'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>, { username: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
    }),
    register: builder.mutation<ApiResponse<any>, { username: string; password: string; email: string; phone?: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', data: body }),
    }),

    // Elderly
    getElderlies: builder.query<ApiResponse<PagedData<Elderly>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/elderly?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['Elderly'],
    }),
    getElderlyById: builder.query<ApiResponse<Elderly>, number>({
      query: (id) => ({ url: `/elderly/${id}`, method: 'GET' }),
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

    // Elderly Profile
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

    // Medical Profile
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

    // Diseases
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

    // Elderly Diseases
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

    // Emergency Contacts
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

    // Vital Signs
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

    // Caregivers
    getCaregivers: builder.query<ApiResponse<PagedData<Caregiver>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/caregivers?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['Caregiver'],
    }),
    getCaregiverById: builder.query<ApiResponse<Caregiver>, number>({
      query: (id) => ({ url: `/caregivers/${id}`, method: 'GET' }),
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

    // Care Plans
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

    // Care Schedules
    getCareSchedules: builder.query<ApiResponse<PagedData<CareSchedule>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/care-schedules?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['CareSchedule'],
    }),
    getCareSchedulesByElderly: builder.query<ApiResponse<CareSchedule[]>, number>({
      query: (elderlyId) => ({ url: `/care-schedules/elderly/${elderlyId}`, method: 'GET' }),
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

    // Medications
    getMedications: builder.query<ApiResponse<PagedData<Medication>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/medications?page=${page}&size=${size}`, method: 'GET' }),
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

    // Medication Schedules
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

    // Prescriptions
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

    // Functional Assessments
    getFunctionalAssessments: builder.query<ApiResponse<FunctionalAssessment[]>, number>({
      query: (elderlyId) => ({ url: `/functional-assessments/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['FunctionalAssessment'],
    }),
    createFunctionalAssessment: builder.mutation<ApiResponse<FunctionalAssessment>, Partial<FunctionalAssessment>>({
      query: (body) => ({ url: '/functional-assessments', method: 'POST', data: body }),
      invalidatesTags: ['FunctionalAssessment'],
    }),

    // Mental Health Assessments
    getMentalHealthAssessments: builder.query<ApiResponse<MentalHealthAssessment[]>, number>({
      query: (elderlyId) => ({ url: `/mental-health-assessments/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['MentalHealthAssessment'],
    }),
    createMentalHealthAssessment: builder.mutation<ApiResponse<MentalHealthAssessment>, Partial<MentalHealthAssessment>>({
      query: (body) => ({ url: '/mental-health-assessments', method: 'POST', data: body }),
      invalidatesTags: ['MentalHealthAssessment'],
    }),

    // Incident Reports
    getIncidentReports: builder.query<ApiResponse<PagedData<IncidentReport>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/incident-reports?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['IncidentReport'],
    }),
    getIncidentReportsByElderly: builder.query<ApiResponse<IncidentReport[]>, number>({
      query: (elderlyId) => ({ url: `/incident-reports/elderly/${elderlyId}`, method: 'GET' }),
      providesTags: ['IncidentReport'],
    }),
    createIncidentReport: builder.mutation<ApiResponse<IncidentReport>, Partial<IncidentReport>>({
      query: (body) => ({ url: '/incident-reports', method: 'POST', data: body }),
      invalidatesTags: ['IncidentReport'],
    }),
    updateIncidentReport: builder.mutation<ApiResponse<IncidentReport>, { id: number; body: Partial<IncidentReport> }>({
      query: ({ id, body }) => ({ url: `/incident-reports/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['IncidentReport'],
    }),

    // Service Packages
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

    // Payments
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

    // Notifications
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

    // Users
    getUsers: builder.query<ApiResponse<PagedData<User>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/users?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({ url: '/users', method: 'POST', data: body }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: number; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    // Roles
    getRoles: builder.query<ApiResponse<PagedData<Role>>, void>({
      query: () => ({ url: '/roles?page=0&size=100', method: 'GET' }),
      providesTags: ['Role'],
    }),

    // Audit Logs
    getAuditLogs: builder.query<ApiResponse<PagedData<AuditLog>>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({ url: `/audit-logs?page=${page}&size=${size}`, method: 'GET' }),
      providesTags: ['AuditLog'],
    }),

    // Documents
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
  useLoginMutation, useRegisterMutation,
  useGetElderliesQuery, useGetElderlyByIdQuery, useCreateElderlyMutation, useUpdateElderlyMutation, useDeleteElderlyMutation,
  useGetElderlyProfileQuery, useCreateElderlyProfileMutation, useUpdateElderlyProfileMutation,
  useGetMedicalProfileQuery, useCreateMedicalProfileMutation, useUpdateMedicalProfileMutation,
  useGetDiseasesQuery, useCreateDiseaseMutation, useUpdateDiseaseMutation, useDeleteDiseaseMutation,
  useGetElderlyDiseasesQuery, useCreateElderlyDiseaseMutation, useDeleteElderlyDiseaseMutation,
  useGetEmergencyContactsQuery, useCreateEmergencyContactMutation, useUpdateEmergencyContactMutation, useDeleteEmergencyContactMutation,
  useGetVitalSignsQuery, useCreateVitalSignMutation, useUpdateVitalSignMutation, useDeleteVitalSignMutation,
  useGetCaregiversQuery, useGetCaregiverByIdQuery, useCreateCaregiverMutation, useUpdateCaregiverMutation, useDeleteCaregiverMutation,
  useGetCarePlansQuery, useGetCarePlansByElderlyQuery, useCreateCarePlanMutation, useUpdateCarePlanMutation, useDeleteCarePlanMutation,
  useGetCareSchedulesQuery, useGetCareSchedulesByElderlyQuery, useCreateCareScheduleMutation, useUpdateCareScheduleMutation, useDeleteCareScheduleMutation,
  useGetMedicationsQuery, useCreateMedicationMutation, useUpdateMedicationMutation, useDeleteMedicationMutation,
  useGetMedicationSchedulesByElderlyQuery, useCreateMedicationScheduleMutation, useUpdateMedicationScheduleMutation, useDeleteMedicationScheduleMutation,
  useGetPrescriptionsByElderlyQuery, useCreatePrescriptionMutation, useUpdatePrescriptionMutation, useDeletePrescriptionMutation,
  useGetFunctionalAssessmentsQuery, useCreateFunctionalAssessmentMutation,
  useGetMentalHealthAssessmentsQuery, useCreateMentalHealthAssessmentMutation,
  useGetIncidentReportsQuery, useGetIncidentReportsByElderlyQuery, useCreateIncidentReportMutation, useUpdateIncidentReportMutation,
  useGetServicePackagesQuery, useCreateServicePackageMutation, useUpdateServicePackageMutation, useDeleteServicePackageMutation,
  useGetPaymentsQuery, useGetPaymentsByElderlyQuery, useCreatePaymentMutation, useUpdatePaymentMutation,
  useGetNotificationsQuery, useGetUnreadCountQuery, useMarkNotificationReadMutation, useDeleteNotificationMutation,
  useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetRolesQuery,
  useGetAuditLogsQuery,
  useGetDocumentsByElderlyQuery, useCreateDocumentMutation, useDeleteDocumentMutation,
} = api;
