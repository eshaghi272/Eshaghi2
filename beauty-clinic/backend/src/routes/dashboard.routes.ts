// Path: backend/src/routes/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { 
  authenticate, 
  isAdmin, 
  isDoctor, 
  isReceptionist, 
  isPatient 
} from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای ادمین =====
// ============================================

// نمای کلی داشبورد
router.get('/overview', authenticate, isAdmin, DashboardController.getOverview);

// آمار نوبت‌ها
router.get('/appointments', authenticate, isAdmin, DashboardController.getAppointmentStats);

// درآمد ماهانه
router.get('/revenue', authenticate, isAdmin, DashboardController.getMonthlyRevenue);

// آمار پزشکان (برای ادمین)
router.get('/doctors', authenticate, isAdmin, DashboardController.getAdminDoctorStats);

// خدمات محبوب
router.get('/popular-services', authenticate, isAdmin, DashboardController.getPopularServices);

// نوبت‌های اخیر
router.get('/recent-appointments', authenticate, isAdmin, DashboardController.getRecentAppointments);

// کمبود موجودی
router.get('/low-stock', authenticate, isAdmin, DashboardController.getLowStockItems);

// اطلاعات کلینیک
router.get('/clinic-info', authenticate, isAdmin, DashboardController.getClinicInfo);

// آمار درمان‌ها
router.get('/treatment-stats', authenticate, isAdmin, DashboardController.getTreatmentStats);


// ============================================
// ===== مسیرهای بیمار =====
// ============================================

// دریافت اطلاعات پروفایل بیمار
router.get('/patient/profile', authenticate, isPatient, DashboardController.getPatientProfile);

// دریافت نوبت‌های بیمار
router.get('/patient/appointments', authenticate, isPatient, DashboardController.getPatientAppointments);

// دریافت درمان‌های بیمار
router.get('/patient/treatments', authenticate, isPatient, DashboardController.getPatientTreatments);

// آمار داشبورد بیمار
router.get('/patient/stats', authenticate, isPatient, DashboardController.getPatientStats);


// ============================================
// ===== مسیرهای پزشک =====
// ============================================

// دریافت اطلاعات پروفایل پزشک
router.get('/doctor/profile', authenticate, isDoctor, DashboardController.getDoctorProfile);

// دریافت نوبت‌های پزشک
router.get('/doctor/appointments', authenticate, isDoctor, DashboardController.getDoctorAppointments);

// آمار داشبورد پزشک
router.get('/doctor/stats', authenticate, isDoctor, DashboardController.getDoctorDashboardStats);


// ============================================
// ===== مسیرهای منشی =====
// ============================================

// آمار داشبورد منشی
router.get('/receptionist/stats', authenticate, isReceptionist, DashboardController.getReceptionistStats);

// دریافت نوبت‌های امروز
router.get('/receptionist/today', authenticate, isReceptionist, DashboardController.getTodayAppointments);

export default router;