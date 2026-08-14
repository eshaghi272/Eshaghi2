// Path: backend/src/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

// ============================================
// توابع کمکی برای تاریخ شمسی
// ============================================

// تبدیل میلادی به شمسی
function toPersianDate(date: Date): { year: number; month: number; day: number } {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = gregorianDay;
  for (let i = 1; i < gregorianMonth; i++) {
    dayOfYear += daysInMonth[i];
  }
  
  const isLeap = (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) || (gregorianYear % 400 === 0);
  if (isLeap && gregorianMonth > 2) dayOfYear++;

  let persianYear = gregorianYear - 621;
  let persianMonth = 10;
  let persianDay = 11;
  
  const persianDaysInMonth = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  const isPersianLeap = (persianYear % 4 === 0 && persianYear % 100 !== 0) || (persianYear % 400 === 0);
  if (isPersianLeap) persianDaysInMonth[12] = 30;

  const persianDayOfYear = dayOfYear - 79;
  if (persianDayOfYear <= 0) {
    persianYear--;
    const prevIsPersianLeap = (persianYear % 4 === 0 && persianYear % 100 !== 0) || (persianYear % 400 === 0);
    const prevPersianDaysInMonth = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    if (prevIsPersianLeap) prevPersianDaysInMonth[12] = 30;
    let remaining = persianDayOfYear + 365 + (prevIsPersianLeap ? 1 : 0);
    for (let i = 1; i <= 12; i++) {
      if (remaining <= prevPersianDaysInMonth[i]) {
        persianMonth = i;
        persianDay = remaining;
        break;
      }
      remaining -= prevPersianDaysInMonth[i];
    }
  } else {
    let remaining = persianDayOfYear;
    for (let i = 1; i <= 12; i++) {
      if (remaining <= persianDaysInMonth[i]) {
        persianMonth = i;
        persianDay = remaining;
        break;
      }
      remaining -= persianDaysInMonth[i];
    }
  }

  return { year: persianYear, month: persianMonth, day: persianDay };
}

// دریافت تاریخ امروز به صورت رشته
function getTodayPersian(): string {
  const { year, month, day } = toPersianDate(new Date());
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

// دریافت تاریخ امروز به صورت شیء
function getCurrentPersianDate(): { year: number; month: number; day: number } {
  return toPersianDate(new Date());
}

// ============================================
// کنترلر داشبورد
// ============================================

export class DashboardController {
  // ============================================
  // ===== مسیرهای ادمین =====
  // ============================================

  static async getOverview(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const today = getCurrentPersianDate();
      const todayPersian = getTodayPersian();

      const totalPatients = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_users WHERE role = 'patient' AND isActive = 1 AND clinicId = ?"
      ).get(clinicId) as { count: number };

      const totalDoctors = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_users WHERE role = 'doctor' AND isActive = 1 AND clinicId = ?"
      ).get(clinicId) as { count: number };

      const totalServices = db.prepare(
        'SELECT COUNT(*) as count FROM tbl_services WHERE isActive = 1 AND clinicId = ?'
      ).get(clinicId) as { count: number };

      const todayAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE fdate = ? AND status != 'cancelled' AND clinicId = ?"
      ).get(todayPersian, clinicId) as { count: number };

      const pendingAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE status = 'pending' AND clinicId = ?"
      ).get(clinicId) as { count: number };

      const monthlyRevenue = db.prepare(`
        SELECT COALESCE(SUM(finalTotal), 0) as total 
        FROM tbl_treatments 
        WHERE paymentStatus = 'paid' 
        AND clinicId = ? 
        AND strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now')
      `).get(clinicId) as { total: number };

      res.json({
        totalPatients: totalPatients?.count || 0,
        totalDoctors: totalDoctors?.count || 0,
        totalServices: totalServices?.count || 0,
        todayAppointments: todayAppointments?.count || 0,
        pendingAppointments: pendingAppointments?.count || 0,
        monthlyRevenue: monthlyRevenue?.total || 0,
        month: today.month,
        year: today.year
      });
    } catch (error) {
      console.error('❌ Dashboard overview error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار داشبورد' });
    }
  }

  static async getAppointmentStats(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
        FROM tbl_appointments
        WHERE clinicId = ?
      `).get(clinicId) as any;

      res.json(stats);
    } catch (error) {
      console.error('❌ Get appointment stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار نوبت‌ها' });
    }
  }

  static async getMonthlyRevenue(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { months = 6 } = req.query;
      const limit = Number(months) || 6;

      const revenue = db.prepare(`
        SELECT 
          strftime('%Y-%m', createdAt) as month,
          COALESCE(SUM(finalTotal), 0) as total
        FROM tbl_treatments
        WHERE clinicId = ? AND paymentStatus = 'paid'
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY createdAt DESC
        LIMIT ?
      `).all(clinicId, limit) as any[];

      res.json(revenue);
    } catch (error) {
      console.error('❌ Get monthly revenue error:', error);
      res.status(500).json({ message: 'خطا در دریافت درآمد ماهانه' });
    }
  }

  static async getAdminDoctorStats(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const stats = db.prepare(`
        SELECT 
          u.id,
          u.fullName as doctorName,
          COUNT(a.id) as totalAppointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completedAppointments
        FROM tbl_users u
        LEFT JOIN tbl_appointments a ON a.doctorId = u.id AND a.clinicId = u.clinicId
        WHERE u.role = 'doctor' AND u.isActive = 1 AND u.clinicId = ?
        GROUP BY u.id
        ORDER BY totalAppointments DESC
      `).all(clinicId) as any[];

      res.json(stats);
    } catch (error) {
      console.error('❌ Get admin doctor stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار پزشکان' });
    }
  }

  static async getPopularServices(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { limit = 5 } = req.query;

      const services = db.prepare(`
        SELECT 
          s.id,
          s.name as serviceName,
          s.price,
          COUNT(a.id) as totalAppointments
        FROM tbl_services s
        LEFT JOIN tbl_appointments a ON a.serviceId = s.id AND a.clinicId = s.clinicId
        WHERE s.isActive = 1 AND s.clinicId = ?
        GROUP BY s.id
        ORDER BY totalAppointments DESC
        LIMIT ?
      `).all(clinicId, Number(limit)) as any[];

      res.json(services);
    } catch (error) {
      console.error('❌ Get popular services error:', error);
      res.status(500).json({ message: 'خطا در دریافت خدمات محبوب' });
    }
  }

  static async getRecentAppointments(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { limit = 5 } = req.query;

      const appointments = db.prepare(`
        SELECT 
          a.id,
          a.fdate,
          a.appointmentTime,
          a.status,
          a.notes,
          u.fullName as patientName,
          d.fullName as doctorName,
          s.name as serviceName
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_users d ON a.doctorId = d.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.clinicId = ?
        ORDER BY a.createdAt DESC
        LIMIT ?
      `).all(clinicId, Number(limit)) as any[];

      res.json(appointments);
    } catch (error) {
      console.error('❌ Get recent appointments error:', error);
      res.status(500).json({ message: 'خطا در دریافت نوبت‌های اخیر' });
    }
  }

  static async getLowStockItems(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const items = db.prepare(`
        SELECT 
          id,
          name,
          quantity,
          minThreshold,
          category
        FROM tbl_materials 
        WHERE clinicId = ? AND isActive = 1 AND quantity <= minThreshold
        ORDER BY quantity ASC
      `).all(clinicId) as any[];

      res.json(items);
    } catch (error) {
      console.error('❌ Get low stock items error:', error);
      res.status(500).json({ message: 'خطا در دریافت موارد کمبود موجودی' });
    }
  }

  static async getClinicInfo(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const clinic = db.prepare(`
        SELECT id, clinicName, clinicCode, address, phone, email, website, managerName, isActive
        FROM tbl_clinics WHERE id = ?
      `).get(clinicId) as any;

      if (!clinic) {
        return res.status(404).json({ message: 'کلینیک یافت نشد' });
      }

      res.json(clinic);
    } catch (error) {
      console.error('❌ Get clinic info error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات کلینیک' });
    }
  }

  static async getTreatmentStats(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as totalTreatments,
          COALESCE(SUM(finalTotal), 0) as totalRevenue,
          COALESCE(SUM(doctorWage), 0) as totalDoctorWage,
          COALESCE(SUM(clinicProfit), 0) as totalClinicProfit,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
        FROM tbl_treatments
        WHERE clinicId = ?
      `).get(clinicId) as any;

      res.json(stats);
    } catch (error) {
      console.error('❌ Get treatment stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار درمان‌ها' });
    }
  }

  // ============================================
  // ===== مسیرهای بیمار =====
  // ============================================

  static async getPatientProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const patient = db.prepare(`
        SELECT 
          id, fullName, mobile, email, nationalCode, createdAt
        FROM tbl_users 
        WHERE id = ? AND role = 'patient' AND isActive = 1 AND clinicId = ?
      `).get(userId, clinicId) as any;

      if (!patient) {
        return res.status(404).json({ message: 'بیمار یافت نشد' });
      }

      res.json(patient);
    } catch (error) {
      console.error('❌ Get patient profile error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات بیمار' });
    }
  }

  static async getPatientAppointments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const appointments = db.prepare(`
        SELECT 
          a.id, a.fdate, a.appointmentTime, a.status, a.notes,
          u.fullName as doctorName,
          s.name as serviceName,
          s.price as servicePrice
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.doctorId = u.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.patientId = ? AND a.clinicId = ?
        ORDER BY a.createdAt DESC
      `).all(userId, clinicId) as any[];

      res.json(appointments);
    } catch (error) {
      console.error('❌ Get patient appointments error:', error);
      res.status(500).json({ message: 'خطا در دریافت نوبت‌های بیمار' });
    }
  }

  static async getPatientTreatments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const treatments = db.prepare(`
        SELECT 
          t.id, t.serviceName, t.finalPrice, t.status, t.description,
          t.createdAt as treatmentDate,
          u.fullName as doctorName
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.doctorId = u.id
        WHERE t.patientId = ? AND t.clinicId = ?
        ORDER BY t.createdAt DESC
      `).all(userId, clinicId) as any[];

      res.json(treatments);
    } catch (error) {
      console.error('❌ Get patient treatments error:', error);
      res.status(500).json({ message: 'خطا در دریافت درمان‌های بیمار' });
    }
  }

  static async getPatientStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const totalAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE patientId = ? AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const pendingAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE patientId = ? AND status = 'pending' AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const upcomingAppointments = db.prepare(`
        SELECT COUNT(*) as count 
        FROM tbl_appointments 
        WHERE patientId = ? 
        AND status IN ('pending', 'confirmed') 
        AND fdate >= ?
        AND clinicId = ?
      `).get(userId, getTodayPersian(), clinicId) as { count: number };

      const completedAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE patientId = ? AND status = 'completed' AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const totalTreatments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_treatments WHERE patientId = ? AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const totalSpent = db.prepare(`
        SELECT COALESCE(SUM(finalPrice), 0) as total 
        FROM tbl_treatments 
        WHERE patientId = ? AND status = 'completed' AND clinicId = ?
      `).get(userId, clinicId) as { total: number };

      const lastVisit = db.prepare(`
        SELECT fdate 
        FROM tbl_appointments 
        WHERE patientId = ? AND status = 'completed' AND clinicId = ?
        ORDER BY fdate DESC LIMIT 1
      `).get(userId, clinicId) as any;

      res.json({
        totalAppointments: totalAppointments?.count || 0,
        pendingAppointments: pendingAppointments?.count || 0,
        upcomingAppointments: upcomingAppointments?.count || 0,
        completedAppointments: completedAppointments?.count || 0,
        totalTreatments: totalTreatments?.count || 0,
        totalSpent: totalSpent?.total || 0,
        lastVisitDate: lastVisit?.fdate || null
      });
    } catch (error) {
      console.error('❌ Get patient stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار بیمار' });
    }
  }

  // ============================================
  // ===== مسیرهای پزشک =====
  // ============================================

  static async getDoctorProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const doctor = db.prepare(`
        SELECT 
          id, fullName, mobile, email, nationalCode, createdAt
        FROM tbl_users 
        WHERE id = ? AND role = 'doctor' AND isActive = 1 AND clinicId = ?
      `).get(userId, clinicId) as any;

      if (!doctor) {
        return res.status(404).json({ message: 'پزشک یافت نشد' });
      }

      res.json(doctor);
    } catch (error) {
      console.error('❌ Get doctor profile error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات پزشک' });
    }
  }

  static async getDoctorAppointments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const appointments = db.prepare(`
        SELECT 
          a.id, a.fdate, a.appointmentTime, a.status, a.notes,
          u.fullName as patientName,
          s.name as serviceName,
          s.price as servicePrice
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.doctorId = ? AND a.clinicId = ?
        ORDER BY a.createdAt DESC
      `).all(userId, clinicId) as any[];

      res.json(appointments);
    } catch (error) {
      console.error('❌ Get doctor appointments error:', error);
      res.status(500).json({ message: 'خطا در دریافت نوبت‌های پزشک' });
    }
  }

  static async getDoctorDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      const totalAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const todayAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND fdate = ? AND status != 'cancelled' AND clinicId = ?"
      ).get(userId, getTodayPersian(), clinicId) as { count: number };

      const pendingAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND status = 'pending' AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const completedAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND status = 'completed' AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      const totalPatients = db.prepare(
        "SELECT COUNT(DISTINCT patientId) as count FROM tbl_appointments WHERE doctorId = ? AND clinicId = ?"
      ).get(userId, clinicId) as { count: number };

      res.json({
        totalAppointments: totalAppointments?.count || 0,
        todayAppointments: todayAppointments?.count || 0,
        pendingAppointments: pendingAppointments?.count || 0,
        completedAppointments: completedAppointments?.count || 0,
        totalPatients: totalPatients?.count || 0,
        totalRevenue: 0
      });
    } catch (error) {
      console.error('❌ Get doctor dashboard stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار پزشک' });
    }
  }

  // ============================================
  // ===== مسیرهای منشی =====
  // ============================================

  static async getReceptionistStats(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const todayAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE fdate = ? AND status != 'cancelled' AND clinicId = ?"
      ).get(getTodayPersian(), clinicId) as { count: number };

      const pendingAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE status = 'pending' AND clinicId = ?"
      ).get(clinicId) as { count: number };

      const confirmedToday = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE fdate = ? AND status = 'confirmed' AND clinicId = ?"
      ).get(getTodayPersian(), clinicId) as { count: number };

      const totalDoctors = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_users WHERE role = 'doctor' AND isActive = 1 AND clinicId = ?"
      ).get(clinicId) as { count: number };

      const totalPatients = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_users WHERE role = 'patient' AND isActive = 1 AND clinicId = ?"
      ).get(clinicId) as { count: number };

      res.json({
        todayAppointments: todayAppointments?.count || 0,
        pendingAppointments: pendingAppointments?.count || 0,
        confirmedToday: confirmedToday?.count || 0,
        totalDoctors: totalDoctors?.count || 0,
        totalPatients: totalPatients?.count || 0
      });
    } catch (error) {
      console.error('❌ Get receptionist stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار منشی' });
    }
  }

  static async getTodayAppointments(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const todayPersian = getTodayPersian();

      const appointments = db.prepare(`
        SELECT 
          a.id, a.fdate, a.appointmentTime, a.status, a.notes,
          u.fullName as patientName,
          d.fullName as doctorName,
          s.name as serviceName
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_users d ON a.doctorId = d.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.fdate = ? AND a.clinicId = ?
        ORDER BY a.appointmentTime ASC
      `).all(todayPersian, clinicId) as any[];

      res.json(appointments);
    } catch (error) {
      console.error('❌ Get today appointments error:', error);
      res.status(500).json({ message: 'خطا در دریافت نوبت‌های امروز' });
    }
  }
}