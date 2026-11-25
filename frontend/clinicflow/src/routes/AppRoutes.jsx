import { Routes, Route, Navigate } from "react-router-dom";

// ===== [MALIG-ON] imports =====
import LoginPage from "../pages/LoginPage";
import StaffLoginPage from "../pages/StaffLoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/patient/ProfilePage";
import BookAppointmentPage from "../pages/patient/BookAppointmentPage";
import BillingPage from "../pages/patient/BillingPage";

// ===== [LEPON] imports =====
import NotificationsPage from "../pages/patient/NotificationsPage";
import MyQueuePage from "../pages/patient/MyQueuePage";
import HistoryPage from "../pages/patient/HistoryPage";

// ===== [PADILLA] imports =====
import StaffDashboard from "../pages/staff/StaffDashboard";
import PatientsPage from "../pages/staff/PatientsPage";
import AppointmentsPage from "../pages/staff/AppointmentsPage";
import ServicesPage from "../pages/staff/ServicesPage";
import DoctorsPage from "../pages/staff/DoctorsPage";
import QueueManagementPage from "../pages/staff/QueueManagementPage";
import ReportsPage from "../pages/staff/ReportsPage";

// ===== [TEAM] imports =====
import PatientDashboard from "../pages/patient/PatientDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ===== [MALIG-ON] routes ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/staff-login" element={<StaffLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/patient/profile" element={<ProfilePage />} />
      <Route path="/patient/book" element={<BookAppointmentPage />} />
      <Route path="/patient/billing" element={<BillingPage />} />

      {/* ===== [LEPON] routes ===== */}
      <Route path="/patient/notifications" element={<NotificationsPage />} />
      <Route path="/patient/queue" element={<MyQueuePage />} />
      <Route path="/patient/history" element={<HistoryPage />} />

      {/* ===== [PADILLA] routes ===== */}
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
      <Route path="/staff/patients" element={<PatientsPage />} />
      <Route path="/staff/appointments" element={<AppointmentsPage />} />
      <Route path="/staff/services" element={<ServicesPage />} />
      <Route path="/staff/doctors" element={<DoctorsPage />} />
      <Route path="/staff/queue" element={<QueueManagementPage />} />
      <Route path="/staff/reports" element={<ReportsPage />} />

      {/* ===== [TEAM] routes ===== */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />

    </Routes>
  );
}

export default AppRoutes;
