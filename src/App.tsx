import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import DoctorRoute from "@/components/auth/DoctorRoute";
import PatientRoute from "@/components/auth/PatientRoute";
import StaffRoute from "@/components/auth/StaffRoute";
// import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import QueueStatus from "./pages/QueueStatus";
import CheckQueue from "./pages/CheckQueue";
import HowItWorks from "./pages/HowItWorks";
import ViewRecords from "./pages/ViewRecords";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import GetStarted from "./pages/GetStarted";
import ManageDepartments from "./pages/admin/ManageDepartments";
import ManageDoctors from "./pages/admin/ManageDoctors";
import SystemStatistics from "./pages/admin/SystemStatistics";
import ViewAppointments from "./pages/ViewAppointments";
import PatientDashboard from "./pages/PatientDashboard";
import ManageQueue from "./pages/ManageQueue";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import PatientRecords from './pages/PatientRecords';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/book-appointment" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/queue-status" element={
                <ProtectedRoute>
                  <QueueStatus />
                </ProtectedRoute>
              } />
              <Route path="/check-queue" element={
                <ProtectedRoute>
                  <CheckQueue />
                </ProtectedRoute>
              } />
              <Route path="/records" element={
                <ProtectedRoute>
                  <ViewRecords />
                </ProtectedRoute>
              } />
              <Route path="/departments" element={
                <ProtectedRoute>
                  <Departments />
                </ProtectedRoute>
              } />
              <Route path="/doctors" element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              } />
              <Route path="/get-started" element={
                <ProtectedRoute>
                  <GetStarted />
                </ProtectedRoute>
              } />
              <Route path="/doctor/appointments" element={
                <DoctorRoute>
                  <ViewAppointments />
                </DoctorRoute>
              } />
              <Route path="/patient-dashboard" element={
                <PatientRoute>
                  <PatientDashboard />
                </PatientRoute>
              } />
              <Route path="/manage-queue" element={
                <StaffRoute>
                  <ManageQueue />
                </StaffRoute>
              } />
              <Route path="/patient-records" element={<ProtectedRoute><PatientRecords /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin/departments" element={
                <AdminRoute>
                  <ManageDepartments />
                </AdminRoute>
              } />
              <Route path="/admin/doctors" element={
                <AdminRoute>
                  <ManageDoctors />
                </AdminRoute>
              } />
              <Route path="/admin/statistics" element={
                <AdminRoute>
                  <SystemStatistics />
                </AdminRoute>
              } />

              {/* Doctor routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/view-appointments" element={
                <ProtectedRoute>
                  <ViewAppointments />
                </ProtectedRoute>
              } />
              <Route path="/doctor-profile" element={
                <DoctorRoute>
                  <DoctorProfile />
                </DoctorRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
