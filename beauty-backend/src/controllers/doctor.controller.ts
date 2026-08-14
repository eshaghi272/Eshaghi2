// Path: backend/src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class DoctorController {
  // ============================================
  // ===== متدهای مدیریت پزشکان (موجود) =====
  // ============================================

  // دریافت لیست همه پزشکان
  static async getAllDoctors(req: Request, res: Response) {
    try {
      console.log('🔍 getAllDoctors called');
      const clinicId = req.user?.clinicId || 1;

      const doctors = db.prepare(`
        SELECT 
          u.id as userId,
          u.fullName,
          u.nationalCode,
          u.mobile,
          u.email,
          u.isActive,
          u.createdAt,
          d.id as doctorId,
          d.specialty,
          d.biography,
          d.experienceYears,
          d.consultationFee,
          d.rating,
          COUNT(a.id) as appointmentCount
        FROM tbl_users u
        LEFT JOIN tbl_doctors d ON d.userId = u.id
        LEFT JOIN tbl_appointments a ON a.doctorId = d.id
        WHERE u.role = 'doctor' AND u.clinicId = ?
        GROUP BY u.id
        ORDER BY u.fullName ASC
      `).all(clinicId);

      const formattedDoctors = doctors.map((doc: any) => ({
        id: doc.userId,
        userId: doc.userId,
        fullName: doc.fullName || 'نامشخص',
        nationalCode: doc.nationalCode,
        mobile: doc.mobile,
        email: doc.email,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        doctor: {
          id: doc.doctorId,
          specialty: doc.specialty || 'تعیین نشده',
          biography: doc.biography,
          experienceYears: doc.experienceYears || 0,
          consultationFee: doc.consultationFee || 0,
          rating: doc.rating || 0
        },
        appointmentCount: doc.appointmentCount || 0
      }));

      res.json(formattedDoctors);
    } catch (error) {
      console.error('Get all doctors error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست پزشکان' });
    }
  }

  // دریافت اطلاعات یک پزشک
  static async getDoctorById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const clinicId = req.user?.clinicId || 1;

      console.log(`🔍 getDoctorById: userId = ${userId}`);

      const doctor = db.prepare(`
        SELECT 
          u.id as userId,
          u.fullName,
          u.nationalCode,
          u.mobile,
          u.email,
          u.isActive,
          u.createdAt,
          d.id as doctorId,
          d.specialty,
          d.biography,
          d.experienceYears,
          d.consultationFee,
          d.rating
        FROM tbl_users u
        LEFT JOIN tbl_doctors d ON d.userId = u.id
        WHERE u.id = ? AND u.role = 'doctor' AND u.clinicId = ?
      `).get(userId, clinicId);

      if (!doctor) {
        return res.status(404).json({ message: 'پزشک یافت نشد' });
      }

      const formattedDoctor = {
        id: doctor.userId,
        userId: doctor.userId,
        fullName: doctor.fullName || 'نامشخص',
        nationalCode: doctor.nationalCode,
        mobile: doctor.mobile,
        email: doctor.email,
        isActive: doctor.isActive,
        createdAt: doctor.createdAt,
        doctor: {
          id: doctor.doctorId,
          specialty: doctor.specialty || 'تعیین نشده',
          biography: doctor.biography,
          experienceYears: doctor.experienceYears || 0,
          consultationFee: doctor.consultationFee || 0,
          rating: doctor.rating || 0
        }
      };

      res.json(formattedDoctor);
    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات پزشک' });
    }
  }

  // ایجاد پزشک جدید
  static async createDoctor(req: Request, res: Response) {
    try {
      const { userId, specialty, biography, experienceYears, consultationFee } = req.body;
      const clinicId = req.user?.clinicId || 1;

      const user = db.prepare(
        'SELECT * FROM tbl_users WHERE id = ? AND role = "doctor" AND clinicId = ?'
      ).get(userId, clinicId);
      
      if (!user) {
        return res.status(404).json({ message: 'کاربر پزشک یافت نشد' });
      }

      const existing = db.prepare('SELECT * FROM tbl_doctors WHERE userId = ?').get(userId);
      if (existing) {
        return res.status(409).json({ message: 'اطلاعات پزشک قبلاً ثبت شده است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_doctors (userId, specialty, biography, experienceYears, consultationFee)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(
        userId,
        specialty || 'تعیین نشده',
        biography || null,
        experienceYears || 0,
        consultationFee || 0
      );

      const doctor = db.prepare(`
        SELECT 
          u.id as userId,
          u.fullName,
          u.nationalCode,
          u.mobile,
          u.email,
          u.isActive,
          d.id as doctorId,
          d.specialty,
          d.biography,
          d.experienceYears,
          d.consultationFee,
          d.rating
        FROM tbl_users u
        LEFT JOIN tbl_doctors d ON d.userId = u.id
        WHERE u.id = ?
      `).get(userId);

      const formattedDoctor = {
        id: doctor.userId,
        userId: doctor.userId,
        fullName: doctor.fullName || 'نامشخص',
        nationalCode: doctor.nationalCode,
        mobile: doctor.mobile,
        email: doctor.email,
        isActive: doctor.isActive,
        doctor: {
          id: doctor.doctorId,
          specialty: doctor.specialty || 'تعیین نشده',
          biography: doctor.biography,
          experienceYears: doctor.experienceYears || 0,
          consultationFee: doctor.consultationFee || 0,
          rating: doctor.rating || 0
        }
      };

      res.status(201).json({ message: 'اطلاعات پزشک با موفقیت ثبت شد', doctor: formattedDoctor });
    } catch (error) {
      console.error('Create doctor error:', error);
      res.status(500).json({ message: 'خطا در ثبت اطلاعات پزشک' });
    }
  }

  // بروزرسانی اطلاعات پزشک
  static async updateDoctor(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { specialty, biography, experienceYears, consultationFee } = req.body;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare(
        'SELECT * FROM tbl_doctors d JOIN tbl_users u ON d.userId = u.id WHERE d.userId = ? AND u.clinicId = ?'
      ).get(userId, clinicId);
      
      if (!existing) {
        return res.status(404).json({ message: 'اطلاعات پزشک یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_doctors 
        SET specialty = ?, biography = ?, experienceYears = ?, consultationFee = ?
        WHERE userId = ?
      `);
      stmt.run(
        specialty || existing.specialty,
        biography !== undefined ? biography : existing.biography,
        experienceYears !== undefined ? experienceYears : existing.experienceYears,
        consultationFee !== undefined ? consultationFee : existing.consultationFee,
        userId
      );

      const doctor = db.prepare(`
        SELECT 
          u.id as userId,
          u.fullName,
          u.nationalCode,
          u.mobile,
          u.email,
          u.isActive,
          d.id as doctorId,
          d.specialty,
          d.biography,
          d.experienceYears,
          d.consultationFee,
          d.rating
        FROM tbl_users u
        LEFT JOIN tbl_doctors d ON d.userId = u.id
        WHERE u.id = ?
      `).get(userId);

      const formattedDoctor = {
        id: doctor.userId,
        userId: doctor.userId,
        fullName: doctor.fullName || 'نامشخص',
        nationalCode: doctor.nationalCode,
        mobile: doctor.mobile,
        email: doctor.email,
        isActive: doctor.isActive,
        doctor: {
          id: doctor.doctorId,
          specialty: doctor.specialty || 'تعیین نشده',
          biography: doctor.biography,
          experienceYears: doctor.experienceYears || 0,
          consultationFee: doctor.consultationFee || 0,
          rating: doctor.rating || 0
        }
      };

      res.json({ message: 'اطلاعات پزشک با موفقیت بروزرسانی شد', doctor: formattedDoctor });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات پزشک' });
    }
  }

  // حذف پزشک
  static async deleteDoctor(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const clinicId = req.user?.clinicId || 1;
      
      const result = db.prepare(
        'UPDATE tbl_users SET isActive = 0 WHERE id = ? AND role = "doctor" AND clinicId = ?'
      ).run(userId, clinicId);
      
      if (result.changes === 0) {
        return res.status(404).json({ message: 'پزشک یافت نشد' });
      }

      res.json({ message: 'پزشک با موفقیت غیرفعال شد' });
    } catch (error) {
      console.error('Delete doctor error:', error);
      res.status(500).json({ message: 'خطا در حذف پزشک' });
    }
  }

  // ============================================
  // ===== متدهای جدید برای پزشک (پنل پزشک) =====
  // ============================================

  // ========== دریافت بیماران پزشک ==========
  static async getMyPatients(req: Request, res: Response) {
    try {
      console.log('🔍 getMyPatients called');
      
      const doctorId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      console.log(`🔍 doctorId: ${doctorId}, clinicId: ${clinicId}`);

      if (!doctorId) {
        console.log('❌ No doctorId found');
        return res.status(401).json({ message: 'احراز هویت نشده‌اید' });
      }

      // دریافت لیست بیمارانی که با این پزشک نوبت داشته‌اند
      const patients = db.prepare(`
        SELECT DISTINCT 
          u.id,
          u.fullName,
          u.nationalCode,
          u.mobile,
          u.email,
          (
            SELECT COUNT(*) 
            FROM tbl_appointments a2 
            WHERE a2.patientId = u.id AND a2.doctorId = ?
          ) as appointmentCount,
          (
            SELECT MAX(a3.fdate) 
            FROM tbl_appointments a3 
            WHERE a3.patientId = u.id AND a3.doctorId = ?
          ) as lastVisit
        FROM tbl_users u
        INNER JOIN tbl_appointments a ON a.patientId = u.id
        WHERE u.role = 'patient' 
          AND u.isActive = 1 
          AND a.doctorId = ?
          AND u.clinicId = ?
        ORDER BY lastVisit DESC
      `).all(doctorId, doctorId, doctorId, clinicId);

      console.log(`✅ Found ${patients.length} patients for doctor ${doctorId}`);
      
      res.json(patients);
    } catch (error) {
      console.error('❌ Get doctor patients error:', error);
      res.status(500).json({ message: 'خطا در دریافت بیماران' });
    }
  }

  // ========== دریافت آمار پزشک ==========
  static async getDoctorStats(req: Request, res: Response) {
    try {
      console.log('🔍 getDoctorStats called');
      
      const doctorId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      if (!doctorId) {
        return res.status(401).json({ message: 'احراز هویت نشده‌اید' });
      }

      // تعداد کل بیماران
      const totalPatients = db.prepare(
        "SELECT COUNT(DISTINCT patientId) as count FROM tbl_appointments WHERE doctorId = ? AND clinicId = ?"
      ).get(doctorId, clinicId) as { count: number };

      // تعداد نوبت‌های امروز
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND fdate = ? AND status != 'cancelled' AND clinicId = ?"
      ).get(doctorId, today, clinicId) as { count: number };

      // تعداد نوبت‌های در انتظار
      const pendingAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND status = 'pending' AND clinicId = ?"
      ).get(doctorId, clinicId) as { count: number };

      // تعداد کل نوبت‌ها
      const totalAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND clinicId = ?"
      ).get(doctorId, clinicId) as { count: number };

      // نوبت‌های تکمیل شده
      const completedAppointments = db.prepare(
        "SELECT COUNT(*) as count FROM tbl_appointments WHERE doctorId = ? AND status = 'completed' AND clinicId = ?"
      ).get(doctorId, clinicId) as { count: number };

      console.log(`✅ Doctor stats: totalPatients=${totalPatients?.count || 0}, todayAppointments=${todayAppointments?.count || 0}`);

      res.json({
        totalPatients: totalPatients?.count || 0,
        todayAppointments: todayAppointments?.count || 0,
        pendingAppointments: pendingAppointments?.count || 0,
        totalAppointments: totalAppointments?.count || 0,
        completedAppointments: completedAppointments?.count || 0
      });
    } catch (error) {
      console.error('❌ Get doctor stats error:', error);
      res.status(500).json({ message: 'خطا در دریافت آمار پزشک' });
    }
  }
}