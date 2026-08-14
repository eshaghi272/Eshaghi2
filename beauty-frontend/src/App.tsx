// Path: frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout
import PublicLayout from './components/layout/PublicLayout'
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

// Auth
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Patient
import PatientDashboard from './components/patient/PatientDashboard'
import PatientAppointments from './components/patient/Appointments'
import BookAppointment from './components/patient/BookAppointment'

// Doctor
import DoctorDashboard from './components/doctor/DoctorDashboard'
import DoctorAppointments from './components/doctor/Appointments'
import DoctorPatients from './components/doctor/DoctorPatients'
import DoctorRegisterTreatment from './components/doctor/RegisterTreatment'  // <-- تغییر: ایمپورت از doctor

// Receptionist
import ReceptionistDashboard from './components/receptionist/ReceptionistDashboard'
import ReceptionistAppointments from './components/receptionist/Appointments'
import ReceptionistPatients from './components/receptionist/Patients'
import ReceptionistDoctors from './components/receptionist/Doctors'
import AddEditDoctor from './components/receptionist/AddEditDoctor'
import ReceptionistBookAppointment from './components/receptionist/BookAppointment'
import ReceptionistRegisterTreatment from './components/receptionist/RegisterTreatment'  // <-- تغییر: ایمپورت از receptionist
import DoctorSchedule from './components/receptionist/DoctorSchedule'
import SelectDoctorForSchedule from './components/receptionist/SelectDoctorForSchedule'

// Admin
import AdminDashboard from './components/admin/AdminDashboard'
import Users from './components/admin/Users'
import AddEditUser from './components/admin/AddEditUser'
import Inventory from './components/admin/Inventory'
import AddEditInventory from './components/admin/AddEditInventory'
import AdminAppointments from './components/admin/AdminAppointments'
import ContactMessages from './components/admin/ContactMessages'
import ClinicManagement from './components/admin/ClinicManagement'
import FinancialReport from './components/admin/FinancialReport'

// Common
import Profile from './components/patient/Profile'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardRouter from './components/common/DashboardRouter'
import NotFound from './components/common/NotFound'

const queryClient = new QueryClient()

function App() {
  console.log('🚀 App is rendering')

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster position="top-center" />
              <Routes>
                {/* ===== Public Routes ===== */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* ===== Protected Routes ===== */}
                <Route element={<Layout />}>
                  {/* Admin Dashboard */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Patient Dashboard */}
                  <Route path="/patient/dashboard" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Doctor Dashboard */}
                  <Route path="/doctor/dashboard" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Receptionist Dashboard */}
                  <Route path="/receptionist/dashboard" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <ReceptionistDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Universal Dashboard */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } />

                  {/* Patient Routes */}
                  <Route path="/patient/appointments" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/book-appointment" element={
                    <ProtectedRoute requiredRole="patient">
                      <BookAppointment />
                    </ProtectedRoute>
                  } />

                  {/* Doctor Routes */}
                  <Route path="/doctor/appointments" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/patients" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorPatients />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/register-treatment" element={
                    <ProtectedRoute requiredRole="doctor">  {/* <-- تغییر: فقط doctor */}
                      <DoctorRegisterTreatment />  {/* <-- تغییر: استفاده از کامپوننت پزشک */}
                    </ProtectedRoute>
                  } />

                  {/* Receptionist Routes */}
                  <Route path="/receptionist/appointments" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <ReceptionistAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/patients" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <ReceptionistPatients />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/doctors" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <ReceptionistDoctors />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/add-doctor" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <AddEditDoctor />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/edit-doctor/:id" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <AddEditDoctor />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/doctor-schedule/:doctorId" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <DoctorSchedule />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/select-doctor-schedule" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <SelectDoctorForSchedule />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/book-appointment" element={
                    <ProtectedRoute requiredRole="receptionist">
                      <ReceptionistBookAppointment />
                    </ProtectedRoute>
                  } />
                  <Route path="/receptionist/register-treatment" element={
                    <ProtectedRoute requiredRole="receptionist">  {/* <-- تغییر: فقط receptionist */}
                      <ReceptionistRegisterTreatment />  {/* <-- تغییر: استفاده از کامپوننت منشی */}
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users/add" element={
                    <ProtectedRoute requiredRole="admin">
                      <AddEditUser />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users/edit/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <AddEditUser />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/appointments" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/contact-messages" element={
                    <ProtectedRoute requiredRole="admin">
                      <ContactMessages />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/inventory" element={
                    <ProtectedRoute requiredRole="admin">
                      <Inventory />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/inventory/add" element={
                    <ProtectedRoute requiredRole="admin">
                      <AddEditInventory />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/inventory/edit/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <AddEditInventory />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/clinics" element={
                    <ProtectedRoute requiredRole="admin">
                      <ClinicManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/financial-report" element={
                    <ProtectedRoute requiredRole="admin">
                      <FinancialReport />
                    </ProtectedRoute>
                  } />
                  {/* Profile */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App