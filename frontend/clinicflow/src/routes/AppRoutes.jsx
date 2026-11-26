import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { PortalLayout } from '@/layouts/PortalLayout';
import { patientNavigation, staffNavigation } from '@/lib/constants';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Patient pages (Malig-on & Lepon)
import PatientDashboard from '../pages/patient/PatientDashboard';
import ProfilePage from '../pages/patient/ProfilePage';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';
import BillingPage from '../pages/patient/BillingPage';
import NotificationsPage from '../pages/patient/NotificationsPage';
import MyQueuePage from '../pages/patient/MyQueuePage';
import HistoryPage from '../pages/patient/HistoryPage';

// Staff/Admin pages (Padilla)
import StaffDashboard from '../pages/staff/StaffDashboard';
import PatientsPage from '../pages/staff/PatientsPage';
import AppointmentsPage from '../pages/staff/AppointmentsPage';
import ServicesPage from '../pages/staff/ServicesPage';
import DoctorsPage from '../pages/staff/DoctorsPage';
import QueueManagementPage from '../pages/staff/QueueManagementPage';
import ReportsPage from '../pages/staff/ReportsPage';
import StaffAccountsPage from '../pages/staff/StaffAccountsPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Auth */}
        <Route path="/" element={<HomePage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/staff-login" element={<LoginPage role="staff" />} />
          <Route path="/staff/login" element={<LoginPage role="staff" />} />
          <Route path="/staff-register" element={<RegisterPage role="staff" />} />
          <Route path="/staff/register" element={<RegisterPage role="staff" />} />
        </Route>

        {/* Patient Portal (patient accounts only) */}
        <Route
          path="/patient"
          element={<PortalLayout links={patientNavigation} role="patient" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="book" element={<BookAppointmentPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="queue" element={<MyQueuePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>

        {/* Staff / Admin Portal (staff accounts only) */}
        <Route
          path="/staff"
          element={<PortalLayout links={staffNavigation} role="staff" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="queue" element={<QueueManagementPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="accounts" element={<StaffAccountsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
