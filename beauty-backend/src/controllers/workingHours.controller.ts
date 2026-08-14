// Path: backend/src/controllers/workingHours.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

const daysOfWeek = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه'
];

export class WorkingHoursController {
  // ========== دریافت برنامه کامل پزشک ==========
  static async getDoctorSchedule(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;

      const workingDays = db.prepare(
        'SELECT * FROM tbl_working_days WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek'
      ).all(doctorId, clinicId) as any[];

      const workingHours = db.prepare(
        'SELECT * FROM tbl_working_hours WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek, startTime'
      ).all(doctorId, clinicId) as any[];

      const schedule: any[] = [];
      
      for (let i = 0; i < 7; i++) {
        const dayData: any = {
          dayOfWeek: i,
          dayName: daysOfWeek[i],
          isWorking: false,
          startTime: null,
          endTime: null,
          slotDuration: 30
        };

        const isWorkingDay = workingDays.some((d: any) => d.dayOfWeek === i);
        if (isWorkingDay) {
          dayData.isWorking = true;
          
          const hours = workingHours.find((h: any) => h.dayOfWeek === i);
          if (hours) {
            dayData.startTime = hours.startTime;
            dayData.endTime = hours.endTime;
            dayData.slotDuration = hours.slotDuration || 30;
          }
        }

        schedule.push(dayData);
      }

      res.json(schedule);
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      res.status(500).json({ message: 'خطا در دریافت برنامه پزشک' });
    }
  }

  // ========== ذخیره برنامه کامل پزشک ==========
  static async saveDoctorSchedule(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { schedule } = req.body;

      if (!schedule || !Array.isArray(schedule)) {
        return res.status(400).json({ message: 'اطلاعات برنامه ناقص است' });
      }

      db.prepare('UPDATE tbl_working_days SET isActive = 0 WHERE doctorId = ? AND clinicId = ?').run(doctorId, clinicId);
      db.prepare('UPDATE tbl_working_hours SET isActive = 0 WHERE doctorId = ? AND clinicId = ?').run(doctorId, clinicId);

      const dayStmt = db.prepare(`
        INSERT INTO tbl_working_days (doctorId, clinicId, dayOfWeek, isActive)
        VALUES (?, ?, ?, 1)
      `);

      const hourStmt = db.prepare(`
        INSERT INTO tbl_working_hours (doctorId, clinicId, dayOfWeek, startTime, endTime, slotDuration, isActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);

      for (const item of schedule) {
        if (item.isWorking) {
          dayStmt.run(doctorId, clinicId, item.dayOfWeek);
          
          if (item.startTime && item.endTime) {
            hourStmt.run(
              doctorId,
              clinicId,
              item.dayOfWeek,
              item.startTime,
              item.endTime,
              item.slotDuration || 30
            );
          }
        }
      }

      const newSchedule = await WorkingHoursController.getDoctorScheduleInternal(doctorId, clinicId);

      res.json({
        message: 'برنامه کاری با موفقیت ذخیره شد',
        schedule: newSchedule
      });
    } catch (error) {
      console.error('Save doctor schedule error:', error);
      res.status(500).json({ message: 'خطا در ذخیره برنامه کاری' });
    }
  }

  // ========== متد داخلی برای دریافت برنامه ==========
  static async getDoctorScheduleInternal(doctorId: string, clinicId: number) {
    try {
      const workingDays = db.prepare(
        'SELECT * FROM tbl_working_days WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek'
      ).all(doctorId, clinicId) as any[];

      const workingHours = db.prepare(
        'SELECT * FROM tbl_working_hours WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek, startTime'
      ).all(doctorId, clinicId) as any[];

      const schedule: any[] = [];
      
      for (let i = 0; i < 7; i++) {
        const dayData: any = {
          dayOfWeek: i,
          dayName: daysOfWeek[i],
          isWorking: false,
          startTime: null,
          endTime: null,
          slotDuration: 30
        };

        const isWorkingDay = workingDays.some((d: any) => d.dayOfWeek === i);
        if (isWorkingDay) {
          dayData.isWorking = true;
          
          const hours = workingHours.find((h: any) => h.dayOfWeek === i);
          if (hours) {
            dayData.startTime = hours.startTime;
            dayData.endTime = hours.endTime;
            dayData.slotDuration = hours.slotDuration || 30;
          }
        }

        schedule.push(dayData);
      }

      return schedule;
    } catch (error) {
      console.error('Get doctor schedule internal error:', error);
      throw error;
    }
  }

  // ========== روزهای کاری ==========
  
  static async getWorkingDays(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      
      const workingDays = db.prepare(
        'SELECT * FROM tbl_working_days WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek'
      ).all(doctorId, clinicId) as any[];

      const result = workingDays.map((day: any) => ({
        ...day,
        dayName: daysOfWeek[day.dayOfWeek]
      }));

      res.json(result);
    } catch (error) {
      console.error('Get working days error:', error);
      res.status(500).json({ message: 'خطا در دریافت روزهای کاری' });
    }
  }

  static async setWorkingDays(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { days } = req.body;

      if (!Array.isArray(days) || days.length === 0) {
        return res.status(400).json({ message: 'لیست روزهای کاری را ارسال کنید' });
      }

      db.prepare('UPDATE tbl_working_days SET isActive = 0 WHERE doctorId = ? AND clinicId = ?').run(doctorId, clinicId);

      const stmt = db.prepare(`
        INSERT INTO tbl_working_days (doctorId, clinicId, dayOfWeek, isActive)
        VALUES (?, ?, ?, 1)
      `);

      for (const day of days) {
        if (day >= 0 && day <= 6) {
          stmt.run(doctorId, clinicId, day);
        }
      }

      const workingDays = db.prepare(
        'SELECT * FROM tbl_working_days WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek'
      ).all(doctorId, clinicId) as any[];

      res.json({
        message: 'روزهای کاری با موفقیت تنظیم شد',
        workingDays: workingDays.map((d: any) => ({
          ...d,
          dayName: daysOfWeek[d.dayOfWeek]
        }))
      });
    } catch (error) {
      console.error('Set working days error:', error);
      res.status(500).json({ message: 'خطا در تنظیم روزهای کاری' });
    }
  }

  // ========== ساعت‌های کاری ==========

  static async getWorkingHours(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { dayOfWeek } = req.query;

      let query = 'SELECT * FROM tbl_working_hours WHERE doctorId = ? AND clinicId = ? AND isActive = 1';
      const params: any[] = [doctorId, clinicId];

      if (dayOfWeek !== undefined) {
        query += ' AND dayOfWeek = ?';
        params.push(Number(dayOfWeek));
      }

      query += ' ORDER BY dayOfWeek, startTime';

      const workingHours = db.prepare(query).all(...params) as any[];

      let breakQuery = 'SELECT * FROM tbl_break_times WHERE doctorId = ? AND clinicId = ? AND isActive = 1';
      const breakParams: any[] = [doctorId, clinicId];

      if (dayOfWeek !== undefined) {
        breakQuery += ' AND dayOfWeek = ?';
        breakParams.push(Number(dayOfWeek));
      }

      const breaks = db.prepare(breakQuery).all(...breakParams) as any[];

      res.json({
        workingHours: workingHours.map((h: any) => ({
          ...h,
          dayName: daysOfWeek[h.dayOfWeek]
        })),
        breaks
      });
    } catch (error) {
      console.error('Get working hours error:', error);
      res.status(500).json({ message: 'خطا در دریافت ساعت‌های کاری' });
    }
  }

  static async setWorkingHours(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { dayOfWeek, startTime, endTime, slotDuration } = req.body;

      if (dayOfWeek === undefined || !startTime || !endTime) {
        return res.status(400).json({ message: 'اطلاعات ناقص است' });
      }

      db.prepare(
        'UPDATE tbl_working_hours SET isActive = 0 WHERE doctorId = ? AND clinicId = ? AND dayOfWeek = ?'
      ).run(doctorId, clinicId, dayOfWeek);

      const stmt = db.prepare(`
        INSERT INTO tbl_working_hours (doctorId, clinicId, dayOfWeek, startTime, endTime, slotDuration, isActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);
      stmt.run(doctorId, clinicId, dayOfWeek, startTime, endTime, slotDuration || 30);

      const workingHours = db.prepare(
        'SELECT * FROM tbl_working_hours WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek, startTime'
      ).all(doctorId, clinicId) as any[];

      res.json({
        message: 'ساعت‌های کاری با موفقیت تنظیم شد',
        workingHours: workingHours.map((h: any) => ({
          ...h,
          dayName: daysOfWeek[h.dayOfWeek]
        }))
      });
    } catch (error) {
      console.error('Set working hours error:', error);
      res.status(500).json({ message: 'خطا در تنظیم ساعت‌های کاری' });
    }
  }

  // ========== زمان‌های استراحت ==========

  static async setBreakTime(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { dayOfWeek, startTime, endTime } = req.body;

      if (dayOfWeek === undefined || !startTime || !endTime) {
        return res.status(400).json({ message: 'اطلاعات ناقص است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_break_times (doctorId, clinicId, dayOfWeek, startTime, endTime, isActive)
        VALUES (?, ?, ?, ?, ?, 1)
      `);
      stmt.run(doctorId, clinicId, dayOfWeek, startTime, endTime);

      const breaks = db.prepare(
        'SELECT * FROM tbl_break_times WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY dayOfWeek, startTime'
      ).all(doctorId, clinicId) as any[];

      res.json({
        message: 'زمان استراحت با موفقیت تنظیم شد',
        breaks
      });
    } catch (error) {
      console.error('Set break time error:', error);
      res.status(500).json({ message: 'خطا در تنظیم زمان استراحت' });
    }
  }

  static async deleteBreakTime(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      
      const result = db.prepare('UPDATE tbl_break_times SET isActive = 0 WHERE id = ? AND clinicId = ?').run(id, clinicId);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'زمان استراحت یافت نشد' });
      }

      res.json({ message: 'زمان استراحت با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete break time error:', error);
      res.status(500).json({ message: 'خطا در حذف زمان استراحت' });
    }
  }

  // ========== روزهای غیرفعال (تعطیلات) ==========

  static async getUnavailableDates(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      
      const dates = db.prepare(
        'SELECT * FROM tbl_unavailable_dates WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY fdate'
      ).all(doctorId, clinicId) as any[];

      res.json(dates);
    } catch (error) {
      console.error('Get unavailable dates error:', error);
      res.status(500).json({ message: 'خطا در دریافت روزهای غیرفعال' });
    }
  }

  static async addUnavailableDate(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId } = req.params;
      const { fdate, reason } = req.body;

      if (!fdate) {
        return res.status(400).json({ message: 'تاریخ الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_unavailable_dates (doctorId, clinicId, fdate, reason, isActive)
        VALUES (?, ?, ?, ?, 1)
      `);
      stmt.run(doctorId, clinicId, fdate, reason || null);

      const dates = db.prepare(
        'SELECT * FROM tbl_unavailable_dates WHERE doctorId = ? AND clinicId = ? AND isActive = 1 ORDER BY fdate'
      ).all(doctorId, clinicId) as any[];

      res.json({
        message: 'روز غیرفعال با موفقیت افزوده شد',
        dates
      });
    } catch (error) {
      console.error('Add unavailable date error:', error);
      res.status(500).json({ message: 'خطا در افزودن روز غیرفعال' });
    }
  }

  static async deleteUnavailableDate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      
      const result = db.prepare('UPDATE tbl_unavailable_dates SET isActive = 0 WHERE id = ? AND clinicId = ?').run(id, clinicId);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'روز غیرفعال یافت نشد' });
      }

      res.json({ message: 'روز غیرفعال با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete unavailable date error:', error);
      res.status(500).json({ message: 'خطا در حذف روز غیرفعال' });
    }
  }

  // ========== دریافت زمان‌های خالی ==========
  static async getAvailableSlotsAdvanced(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return res.status(400).json({ message: 'پارامترهای doctorId و date الزامی هستند' });
      }

      const doctorIdNum = Number(doctorId);
      const dateStr = String(date);

      // دریافت روز هفته
      const dateObj = new Date();
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      dateObj.setFullYear(year - 621, month, day);
      const dayOfWeek = dateObj.getDay();
      const persianDayOfWeek = (dayOfWeek + 6) % 7;

      // بررسی روز کاری
      const workingDay = db.prepare(
        'SELECT * FROM tbl_working_days WHERE doctorId = ? AND clinicId = ? AND dayOfWeek = ? AND isActive = 1'
      ).get(doctorIdNum, clinicId, persianDayOfWeek) as any;

      if (!workingDay) {
        return res.status(400).json({ message: 'این روز برای پزشک غیرفعال است' });
      }

      // بررسی روز غیرفعال
      const unavailable = db.prepare(
        'SELECT * FROM tbl_unavailable_dates WHERE doctorId = ? AND clinicId = ? AND fdate = ? AND isActive = 1'
      ).get(doctorIdNum, clinicId, dateStr) as any;

      if (unavailable) {
        return res.status(400).json({ message: 'این تاریخ برای پزشک غیرفعال است' });
      }

      // دریافت ساعت‌های کاری
      const workingHours = db.prepare(
        'SELECT * FROM tbl_working_hours WHERE doctorId = ? AND clinicId = ? AND dayOfWeek = ? AND isActive = 1'
      ).get(doctorIdNum, clinicId, persianDayOfWeek) as any;

      if (!workingHours) {
        return res.status(400).json({ message: 'ساعت کاری برای این روز تنظیم نشده است' });
      }

      // دریافت زمان‌های استراحت
      const breaks = db.prepare(
        'SELECT * FROM tbl_break_times WHERE doctorId = ? AND clinicId = ? AND dayOfWeek = ? AND isActive = 1'
      ).all(doctorIdNum, clinicId, persianDayOfWeek) as any[];

      // دریافت نوبت‌های رزرو شده
      const booked = db.prepare(`
        SELECT appointmentTime FROM tbl_appointments 
        WHERE doctorId = ? AND clinicId = ? AND fdate = ? AND status != 'cancelled'
      `).all(doctorIdNum, clinicId, dateStr) as any[];

      const bookedTimes = booked.map((b: any) => b.appointmentTime);

      // تولید زمان‌های خالی
      const slotDuration = workingHours.slotDuration || 30;
      const startTime = workingHours.startTime;
      const endTime = workingHours.endTime;

      const allSlots: string[] = [];
      let current = startTime;

      while (current < endTime) {
        const isBreak = breaks.some((b: any) => current >= b.startTime && current < b.endTime);
        
        if (!isBreak && !bookedTimes.includes(current)) {
          allSlots.push(current);
        }

        const [hours, minutes] = current.split(':').map(Number);
        let newMinutes = minutes + slotDuration;
        let newHours = hours;
        if (newMinutes >= 60) {
          newMinutes -= 60;
          newHours += 1;
        }
        current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      }

      res.json({
        doctorId: doctorIdNum,
        date: dateStr,
        dayOfWeek: persianDayOfWeek,
        dayName: daysOfWeek[persianDayOfWeek],
        workingHours: {
          startTime,
          endTime,
          slotDuration
        },
        breaks,
        availableSlots: allSlots
      });
    } catch (error) {
      console.error('Get available slots advanced error:', error);
      res.status(500).json({ message: 'خطا در دریافت زمان‌های خالی' });
    }
  }
}