export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PagedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  active?: boolean;
  roles?: Role[];
  createdAt?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface DashboardStats {
  totalElderly: number;
  totalCaregivers: number;
  totalCarePlans: number;
  activeCarePlans: number;
  todaySchedules: number;
  pendingTasks: number;
  unreadNotifications: number;
  monthlyRevenue: number;
}

export interface Elderly {
  id: number;
  code: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  address?: string;
  status?: string;
  familyUserId?: number;
  familyUserName?: string;
  createdAt?: string;
}

export interface ElderlyProfile {
  id: number;
  elderlyId: number;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string;
  notes?: string;
}

export interface MedicalProfile {
  id: number;
  elderlyId: number;
  primaryDiagnosis?: string;
  secondaryDiagnosis?: string;
  surgicalHistory?: string;
  familyHistory?: string;
}

export interface Disease {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
}

export interface ElderlyDisease {
  id: number;
  elderlyId: number;
  diseaseId: number;
  diseaseName?: string;
  diagnosedDate?: string;
  status?: string;
  notes?: string;
}

export interface Document {
  id: number;
  elderlyId: number;
  type: string;
  title: string;
  fileName?: string;
  fileUrl?: string;
  uploadedBy?: number;
  fileSize?: number;
  mimeType?: string;
  description?: string;
  uploadedAt?: string;
}

export interface LabelValueDTO {
  label: string;
  value: number;
}

export interface MonthRevenueDTO {
  month: string;
  total: number;
}

export interface ReportOverview {
  elderlyByStatus: LabelValueDTO[];
  planByStatus: LabelValueDTO[];
  taskByStatus: LabelValueDTO[];
  incidentBySeverity: LabelValueDTO[];
  medicationScheduleByStatus: LabelValueDTO[];
  revenueByMonth: MonthRevenueDTO[];
  caregiverLoad: LabelValueDTO[];
}

export interface HealthAlert {
  elderlyId: number;
  elderlyName: string;
  type: string;
  message: string;
  severity: string;
  recordedAt: string;
}

export interface EmergencyContact {
  id: number;
  elderlyId: number;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface VitalSign {
  id: number;
  elderlyId: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  bloodSugar?: number;
  recordedAt: string;
  notes?: string;
}

export interface Caregiver {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  specialization?: string;
  status: string;
  availability?: string;
  experience?: number;
}

export interface CarePlan {
  id: number;
  elderlyId: number;
  elderlyName?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: string;
  goals?: string;
}

export interface CareSchedule {
  id: number;
  elderlyId: number;
  caregiverId: number;
  elderlyName?: string;
  caregiverName?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface CareTask {
  id: number;
  scheduleId: number;
  taskType: string;
  title?: string;
  description?: string;
  status: string;
  priority?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
}

export interface Medication {
  id: number;
  name: string;
  genericName?: string;
  category?: string;
  unit?: string;
  description?: string;
  isActive: boolean;
}

export interface MedicationSchedule {
  id: number;
  elderlyId: number;
  medicationId: number;
  medicationName?: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  timeOfDay?: string;
  timeToTake?: string;
  date?: string;
  takenAt?: string;
  status: string;
}

export interface Prescription {
  id: number;
  elderlyId: number;
  prescribedBy: string;
  prescribedDate: string;
  diagnosis?: string;
  notes?: string;
  status: string;
}

export interface FunctionalAssessment {
  id: number;
  elderlyId: number;
  assessmentDate: string;
  mobilityScore?: number;
  adlScore?: number;
  cognitiveScore?: number;
  totalScore?: number;
  assessedBy?: string;
  notes?: string;
}

export interface MentalHealthAssessment {
  id: number;
  elderlyId: number;
  assessmentDate: string;
  depressionScore?: number;
  anxietyScore?: number;
  cognitiveScore?: number;
  overallStatus?: string;
  assessedBy?: string;
  notes?: string;
}

export interface IncidentReport {
  id: number;
  elderlyId: number;
  elderlyName?: string;
  incidentDate: string;
  type: string;
  severity: string;
  description: string;
  location?: string;
  actionTaken?: string;
  reportedBy?: string;
  status: string;
}

export interface ServicePackage {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  features?: string;
  isActive: boolean;
}

export interface Payment {
  id: number;
  elderlyId: number;
  elderlyName?: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
  description?: string;
  servicePackageId?: number;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface ServiceBooking {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  servicePackageId?: number;
  servicePackageName?: string;
  preferredDate?: string;
  notes?: string;
  status: string;
  createdAt?: string;
}

export interface Feedback {
  id: number;
  caregiverId: number;
  caregiverName?: string;
  elderlyId?: number;
  elderlyName?: string;
  rating: number;
  comment?: string;
  authorName: string;
  createdAt?: string;
}
