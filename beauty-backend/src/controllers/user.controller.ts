// Path: backend/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';
import bcrypt from 'bcryptjs';

export class UserController {
  // ========== ایجاد کاربر جدید (برای منشی) ==========
  static async create(req: Request, res: Response) {
    try {
      const { fullName, nationalCode, mobile, email, password, role } = req.body;

      // بررسی وجود کاربر
      const existingUser = db.prepare(
        'SELECT * FROM tbl_users WHERE nationalCode = ? OR mobile = ?'
      ).get(nationalCode, mobile);

      if (existingUser) {
        return res.status(409).json({ message: 'کاربر با این کد ملی یا موبایل قبلاً ثبت شده است' });
      }

      // هش کردن رمز عبور
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // ذخیره کاربر
      const stmt = db.prepare(`
        INSERT INTO tbl_users (fullName, nationalCode, mobile, email, passwordHash, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        fullName,
        nationalCode,
        mobile,
        email || null,
        passwordHash,
        role || 'patient'
      );

      // دریافت کاربر ایجاد شده
      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive, createdAt FROM tbl_users WHERE id = ?'
      ).get(result.lastInsertRowid);

      res.status(201).json({ message: 'کاربر با موفقیت ایجاد شد', user });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'خطا در ایجاد کاربر' });
    }
  }

  // ========== دریافت لیست کاربران ==========
  static async getAll(req: Request, res: Response) {
    try {
      const { role } = req.query;
      let query = `
        SELECT 
          u.id, 
          u.fullName, 
          u.nationalCode, 
          u.mobile, 
          u.email, 
          u.role, 
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
      `;
      const params: any[] = [];

      if (role) {
        query += ' WHERE u.role = ?';
        params.push(role);
      }

      query += ' ORDER BY u.createdAt DESC';

      const users = db.prepare(query).all(...params);
      
      const formattedUsers = users.map((user: any) => {
        if (user.role === 'doctor') {
          return {
            id: user.id,
            fullName: user.fullName,
            nationalCode: user.nationalCode,
            mobile: user.mobile,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            doctor: {
              id: user.doctorId,
              specialty: user.specialty,
              biography: user.biography,
              experienceYears: user.experienceYears,
              consultationFee: user.consultationFee,
              rating: user.rating
            }
          };
        }
        return {
          id: user.id,
          fullName: user.fullName,
          nationalCode: user.nationalCode,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        };
      });

      res.json(formattedUsers);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست کاربران' });
    }
  }

  // ========== دریافت یک کاربر ==========
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = db.prepare(`
        SELECT 
          u.id, 
          u.fullName, 
          u.nationalCode, 
          u.mobile, 
          u.email, 
          u.role, 
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
        WHERE u.id = ?
      `).get(id);

      if (!user) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      const appointments = db.prepare(`
        SELECT a.*, s.name as serviceName, u.fullName as doctorName
        FROM tbl_appointments a
        LEFT JOIN tbl_services s ON a.serviceId = s.id
        LEFT JOIN tbl_users u ON a.doctorId = u.id
        WHERE a.patientId = ?
        ORDER BY a.createdAt DESC
      `).all(id);

      const formattedUser: any = {
        id: user.id,
        fullName: user.fullName,
        nationalCode: user.nationalCode,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        appointments
      };

      if (user.role === 'doctor') {
        formattedUser.doctor = {
          id: user.doctorId,
          specialty: user.specialty,
          biography: user.biography,
          experienceYears: user.experienceYears,
          consultationFee: user.consultationFee,
          rating: user.rating
        };
      }

      res.json(formattedUser);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'خطا در دریافت کاربر' });
    }
  }

  // ========== دریافت اطلاعات کاربر جاری ==========
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const user = db.prepare(`
        SELECT 
          u.id, 
          u.fullName, 
          u.nationalCode, 
          u.mobile, 
          u.email, 
          u.role, 
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
        WHERE u.id = ?
      `).get(userId);

      if (!user) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      const formattedUser: any = {
        id: user.id,
        fullName: user.fullName,
        nationalCode: user.nationalCode,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      if (user.role === 'doctor' && user.doctorId) {
        formattedUser.doctor = {
          id: user.doctorId,
          specialty: user.specialty,
          biography: user.biography,
          experienceYears: user.experienceYears,
          consultationFee: user.consultationFee,
          rating: user.rating
        };
      }

      res.json(formattedUser);
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر' });
    }
  }

  // ========== بروزرسانی اطلاعات کاربر جاری ==========
  static async updateMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { fullName, email, password } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_users WHERE id = ?').get(userId);
      if (!existing) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      let updateFields: string[] = [];
      let params: any[] = [];

      if (fullName) {
        updateFields.push('fullName = ?');
        params.push(fullName);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        params.push(email);
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        updateFields.push('passwordHash = ?');
        params.push(passwordHash);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'اطلاعاتی برای بروزرسانی ارسال نشده است' });
      }

      updateFields.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(userId);

      const query = `UPDATE tbl_users SET ${updateFields.join(', ')} WHERE id = ?`;
      db.prepare(query).run(...params);

      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive, createdAt FROM tbl_users WHERE id = ?'
      ).get(userId);

      res.json({ message: 'پروفایل با موفقیت بروزرسانی شد', user });
    } catch (error) {
      console.error('Update me error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی پروفایل' });
    }
  }

  // ========== بروزرسانی کاربر (منشی و ادمین) ==========
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fullName, email, role, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_users WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      let updateFields: string[] = [];
      let params: any[] = [];

      if (fullName) {
        updateFields.push('fullName = ?');
        params.push(fullName);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        params.push(email);
      }
      if (role) {
        updateFields.push('role = ?');
        params.push(role);
      }
      if (isActive !== undefined) {
        updateFields.push('isActive = ?');
        params.push(isActive ? 1 : 0);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'اطلاعاتی برای بروزرسانی ارسال نشده است' });
      }

      updateFields.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id);

      const query = `UPDATE tbl_users SET ${updateFields.join(', ')} WHERE id = ?`;
      db.prepare(query).run(...params);

      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive FROM tbl_users WHERE id = ?'
      ).get(id);

      res.json({ message: 'کاربر با موفقیت بروزرسانی شد', user });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی کاربر' });
    }
  }

  // ========== حذف کاربر (فقط ادمین) ==========
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const existing = db.prepare('SELECT * FROM tbl_users WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      if (existing.role === 'admin') {
        const adminCount = db.prepare('SELECT COUNT(*) as count FROM tbl_users WHERE role = "admin"').get() as { count: number };
        if (adminCount.count <= 1) {
          return res.status(400).json({ message: 'نمی‌توان آخرین ادمین را حذف کرد' });
        }
      }

      db.prepare('DELETE FROM tbl_users WHERE id = ?').run(id);
      res.json({ message: 'کاربر با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'خطا در حذف کاربر' });
    }
  }
}