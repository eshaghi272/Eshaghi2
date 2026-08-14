// Path: backend/src/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class AppointmentController {
  // دریافت لیست نوبت‌ها
  static async getAll(req: Request, res: Response) {
    try {
      const { patientId, doctorId, status } = req.query;
      let query = `
        SELECT a.*, 
               u.fullName as patientName,
               d.fullName as doctorName,
               s.name as serviceName,
               s.price as servicePrice
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_users d ON a.doctorId = d.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (patientId) {
        query += ' AND a.patientId = ?';
        params.push(patientId);
      }
      if (doctorId) {
        query += ' AND a.doctorId = ?';
        params.push(doctorId);
      }
      if (status) {
        query += ' AND a.status = ?';
        params.push(status);
      }

      query += ' ORDER BY a.createdAt DESC';

      const appointments = db.prepare(query).all(...params) as any[];
      res.json(appointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست نوبت‌ها' });
    }
  }

  // دریافت یک نوبت
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appointment = db.prepare(`
        SELECT a.*, 
               u.fullName as patientName,
               d.fullName as doctorName,
               s.name as serviceName,
               s.price as servicePrice
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_users d ON a.doctorId = d.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.id = ?
      `).get(id) as any;

      if (!appointment) {
        return res.status(404).json({ message: 'نوبت یافت نشد' });
      }

      res.json(appointment);
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({ message: 'خطا در دریافت نوبت' });
    }
  }

  // ایجاد نوبت جدید
  static async create(req: Request, res: Response) {
    try {
      const { patientId, doctorId, serviceId, fdate, appointmentTime, notes } = req.body;

      if (!patientId || !doctorId || !serviceId || !fdate || !appointmentTime) {
        return res.status(400).json({ message: 'اطلاعات ناقص است' });
      }

      // بررسی تداخل زمانی
      const conflict = db.prepare(`
        SELECT * FROM tbl_appointments 
        WHERE doctorId = ? AND fdate = ? AND appointmentTime = ? AND status != 'cancelled'
      `).get(doctorId, fdate, appointmentTime) as any;

      if (conflict) {
        return res.status(409).json({ message: 'این زمان قبلاً رزرو شده است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_appointments (patientId, doctorId, serviceId, fdate, appointmentTime, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(patientId, doctorId, serviceId, fdate, appointmentTime, notes || null);

      const appointment = db.prepare(`
        SELECT a.*, 
               u.fullName as patientName,
               d.fullName as doctorName,
               s.name as serviceName
        FROM tbl_appointments a
        LEFT JOIN tbl_users u ON a.patientId = u.id
        LEFT JOIN tbl_users d ON a.doctorId = d.id
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        WHERE a.id = ?
      `).get(result.lastInsertRowid) as any;

      res.status(201).json({ message: 'نوبت با موفقیت رزرو شد', appointment });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ message: 'خطا در رزرو نوبت' });
    }
  }

  // بروزرسانی نوبت
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fdate, appointmentTime, status, notes } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_appointments WHERE id = ?').get(id) as any;
      if (!existing) {
        return res.status(404).json({ message: 'نوبت یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_appointments 
        SET fdate = ?, appointmentTime = ?, status = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        fdate || existing.fdate,
        appointmentTime || existing.appointmentTime,
        status || existing.status,
        notes !== undefined ? notes : existing.notes,
        id
      );

      const appointment = db.prepare('SELECT * FROM tbl_appointments WHERE id = ?').get(id) as any;
      res.json({ message: 'نوبت با موفقیت بروزرسانی شد', appointment });
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی نوبت' });
    }
  }

  // لغو نوبت
  static async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const existing = db.prepare('SELECT * FROM tbl_appointments WHERE id = ?').get(id) as any;
      if (!existing) {
        return res.status(404).json({ message: 'نوبت یافت نشد' });
      }

      if (existing.status === 'cancelled') {
        return res.status(400).json({ message: 'نوبت قبلاً لغو شده است' });
      }

      db.prepare('UPDATE tbl_appointments SET status = "cancelled", updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(id);

      res.json({ message: 'نوبت با موفقیت لغو شد' });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ message: 'خطا در لغو نوبت' });
    }
  }

  // دریافت زمان‌های خالی
  static async getAvailableSlots(req: Request, res: Response) {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return res.status(400).json({ message: 'پارامترهای doctorId و date الزامی هستند' });
      }

      // تمام زمان‌های ممکن (۹ صبح تا ۶ عصر با فواصل ۳۰ دقیقه)
      const allSlots: string[] = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          allSlots.push(time);
        }
      }

      // دریافت نوبت‌های رزرو شده
      const booked = db.prepare(`
        SELECT appointmentTime FROM tbl_appointments 
        WHERE doctorId = ? AND fdate = ? AND status != 'cancelled'
      `).all(doctorId, date) as any[];

      const bookedTimes = booked.map((b: any) => b.appointmentTime);
      const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

      res.json({ availableSlots });
    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({ message: 'خطا در دریافت زمان‌های خالی' });
    }
  }
}