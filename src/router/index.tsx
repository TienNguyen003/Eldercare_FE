import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import PublicLayout from '../components/layout/PublicLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
    <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(13,148,136,0.4)', mb: 1 }}>
      <Favorite sx={{ color: '#fff', fontSize: 20 }} />
    </Box>
    <CircularProgress size={26} sx={{ color: '#0D9488' }} />
  </Box>
);

const wrap = (factory: () => Promise<{ default: React.ComponentType }>) => {
  const Comp = lazy(factory);
  return (
    <Suspense fallback={<Loading />}>
      <Comp />
    </Suspense>
  );
};

// Public
const HomePage      = () => wrap(() => import('../pages/public/HomePage'));
const ServicesPage  = () => wrap(() => import('../pages/public/ServicesPage'));
const AboutPage     = () => wrap(() => import('../pages/public/AboutPage'));
const ContactPage   = () => wrap(() => import('../pages/public/ContactPage'));
const BlogPage      = () => wrap(() => import('../pages/public/BlogPage'));
const FAQPage       = () => wrap(() => import('../pages/public/FAQPage'));
const CaregiverSchedulePage = () => wrap(() => import('../pages/public/CaregiverSchedulePage'));

// Auth
const LoginPage    = () => wrap(() => import('../pages/auth/LoginPage'));
const RegisterPage = () => wrap(() => import('../pages/auth/RegisterPage'));

// Admin
const DashboardPage           = () => wrap(() => import('../pages/DashboardPage'));
const ElderlyListPage         = () => wrap(() => import('../pages/elderly/ElderlyListPage'));
const ElderlyDetailPage       = () => wrap(() => import('../pages/elderly/ElderlyDetailPage'));
const ElderlyDiseasesPage     = () => wrap(() => import('../pages/elderly/ElderlyDiseasesPage'));
const CaregiversPage          = () => wrap(() => import('../pages/caregivers/CaregiversPage'));
const CarePlansPage           = () => wrap(() => import('../pages/careplans/CarePlansPage'));
const CareSchedulesPage       = () => wrap(() => import('../pages/careplans/CareSchedulesPage'));
const VitalSignsPage          = () => wrap(() => import('../pages/vitalsigns/VitalSignsPage'));
const MedicationsPage         = () => wrap(() => import('../pages/medications/MedicationsPage'));
const MedicationSchedulesPage = () => wrap(() => import('../pages/medications/MedicationSchedulesPage'));
const PrescriptionsPage       = () => wrap(() => import('../pages/medications/PrescriptionsPage'));
const AssessmentsPage         = () => wrap(() => import('../pages/assessments/AssessmentsPage'));
const IncidentReportsPage     = () => wrap(() => import('../pages/assessments/IncidentReportsPage'));
const ServicePackagesPage     = () => wrap(() => import('../pages/payments/ServicePackagesPage'));
const PaymentsPage            = () => wrap(() => import('../pages/payments/PaymentsPage'));
const NotificationsPage       = () => wrap(() => import('../pages/notifications/NotificationsPage'));
const UsersPage               = () => wrap(() => import('../pages/settings/UsersPage'));
const RolesPage               = () => wrap(() => import('../pages/settings/RolesPage'));
const AuditLogsPage           = () => wrap(() => import('../pages/settings/AuditLogsPage'));
const CareTasksPage           = () => wrap(() => import('../pages/caretasks/CareTasksPage'));
const ProfilePage             = () => wrap(() => import('../pages/profile/ProfilePage'));
const DocumentsPage           = () => wrap(() => import('../pages/documents/DocumentsPage'));
const ReportsPage             = () => wrap(() => import('../pages/reports/ReportsPage'));
const MyDayPage               = () => wrap(() => import('../pages/myday/MyDayPage'));
const ServiceBookingsPage     = () => wrap(() => import('../pages/bookings/ServiceBookingsPage'));
const FamilyPortalPage        = () => wrap(() => import('../pages/family/FamilyPortalPage'));
const FeedbacksPage           = () => wrap(() => import('../pages/feedbacks/FeedbacksPage'));

const router = createBrowserRouter([
  // Public
  {
    element: <PublicLayout />,
    children: [
      { path: '/home',     element: <HomePage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/about',    element: <AboutPage /> },
      { path: '/contact',  element: <ContactPage /> },
      { path: '/blog',     element: <BlogPage /> },
      { path: '/faq',      element: <FAQPage /> },
      { path: '/caregiver-schedule', element: <CaregiverSchedulePage /> },
    ],
  },

  // Auth
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Admin (protected)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/',                          element: <DashboardPage /> },
          { path: '/elderly',                   element: <ElderlyListPage /> },
          { path: '/elderly/:id',               element: <ElderlyDetailPage /> },
          { path: '/elderly/diseases',          element: <ElderlyDiseasesPage /> },
          { path: '/caregivers',                element: <CaregiversPage /> },
          { path: '/care-plans',                element: <CarePlansPage /> },
                               { path: '/care-schedules',            element: <CareSchedulesPage /> },
           { path: '/care-tasks',                element: <CareTasksPage /> },
          { path: '/vital-signs',               element: <VitalSignsPage /> },
          { path: '/medications',               element: <MedicationsPage /> },
          { path: '/medication-schedules',      element: <MedicationSchedulesPage /> },
          { path: '/prescriptions',             element: <PrescriptionsPage /> },
          { path: '/functional-assessments',    element: <AssessmentsPage /> },
          { path: '/mental-health-assessments', element: <AssessmentsPage /> },
          { path: '/incidents',                 element: <IncidentReportsPage /> },
          { path: '/service-packages',          element: <ServicePackagesPage /> },
          { path: '/service-bookings',          element: <ServiceBookingsPage /> },
          { path: '/payments',                  element: <PaymentsPage /> },
          { path: '/notifications',             element: <NotificationsPage /> },
          { path: '/users',                     element: <UsersPage /> },
          { path: '/roles',                     element: <RolesPage /> },
          { path: '/audit-logs',                element: <AuditLogsPage /> },
          { path: '/documents',                 element: <DocumentsPage /> },
          { path: '/reports',                   element: <ReportsPage /> },
          { path: '/my-day',                    element: <MyDayPage /> },
          { path: '/my-family',                 element: <FamilyPortalPage /> },
          { path: '/feedbacks',                 element: <FeedbacksPage /> },
          { path: '/profile',                   element: <ProfilePage /> },
          { path: '*',                          element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);

export default router;