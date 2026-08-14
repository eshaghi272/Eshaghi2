// Path: backend/src/controllers/clinic.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class ClinicController {
  // ============================================
  // ===== دریافت اطلاعات کلینیک =====
  // ============================================

  // دریافت اطلاعات کلینیک جاری
  static async getClinic(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const clinic = db.prepare(`
        SELECT 
          id,
          clinicName,
          clinicCode,
          address,
          phone,
          mobile,
          email,
          website,
          managerName,
          managerPhone,
          logo,
          description,
          isActive,
          createdAt,
          updatedAt
        FROM tbl_clinics 
        WHERE id = ?
      `).get(clinicId);

      if (!clinic) {
        return res.status(404).json({ message: 'کلینیک یافت نشد' });
      }

      res.json(clinic);
    } catch (error) {
      console.error('❌ Get clinic error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات کلینیک' });
    }
  }

  // دریافت لیست کلینیک‌ها (برای ادمین)
  static async getAllClinics(req: Request, res: Response) {
    try {
      const clinics = db.prepare(`
        SELECT 
          id,
          clinicName,
          clinicCode,
          address,
          phone,
          mobile,
          email,
          website,
          managerName,
          managerPhone,
          isActive,
          createdAt,
          updatedAt
        FROM tbl_clinics 
        ORDER BY createdAt DESC
      `).all();

      res.json(clinics);
    } catch (error) {
      console.error('❌ Get all clinics error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست کلینیک‌ها' });
    }
  }

  // ============================================
  // ===== مدیریت کلینیک (فقط ادمین) =====
  // ============================================

  // ایجاد کلینیک جدید
  static async createClinic(req: Request, res: Response) {
    try {
      const {
        clinicName,
        clinicCode,
        address,
        phone,
        mobile,
        email,
        website,
        managerName,
        managerPhone,
        logo,
        description
      } = req.body;

      // اعتبارسنجی
      if (!clinicName) {
        return res.status(400).json({ message: 'نام کلینیک الزامی است' });
      }

      // بررسی کد کلینیک تکراری
      if (clinicCode) {
        const existing = db.prepare('SELECT id FROM tbl_clinics WHERE clinicCode = ?').get(clinicCode);
        if (existing) {
          return res.status(409).json({ message: 'کد کلینیک قبلاً ثبت شده است' });
        }
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_clinics (
          clinicName, clinicCode, address, phone, mobile, email, website,
          managerName, managerPhone, logo, description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        clinicName,
        clinicCode || null,
        address || null,
        phone || null,
        mobile || null,
        email || null,
        website || null,
        managerName || null,
        managerPhone || null,
        logo || null,
        description || null
      );

      const clinic = db.prepare('SELECT * FROM tbl_clinics WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({
        message: 'کلینیک با موفقیت ایجاد شد',
        clinic
      });
    } catch (error) {
      console.error('❌ Create clinic error:', error);
      res.status(500).json({ message: 'خطا در ایجاد کلینیک' });
    }
  }

  // بروزرسانی کلینیک
  static async updateClinic(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        clinicName,
        clinicCode,
        address,
        phone,
        mobile,
        email,
        website,
        managerName,
        managerPhone,
        logo,
        description,
        isActive
      } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_clinics WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'کلینیک یافت نشد' });
      }

      // بررسی کد کلینیک تکراری
      if (clinicCode && clinicCode !== existing.clinicCode) {
        const duplicate = db.prepare('SELECT id FROM tbl_clinics WHERE clinicCode = ? AND id != ?').get(clinicCode, id);
        if (duplicate) {
          return res.status(409).json({ message: 'کد کلینیک قبلاً ثبت شده است' });
        }
      }

      const stmt = db.prepare(`
        UPDATE tbl_clinics SET
          clinicName = ?,
          clinicCode = ?,
          address = ?,
          phone = ?,
          mobile = ?,
          email = ?,
          website = ?,
          managerName = ?,
          managerPhone = ?,
          logo = ?,
          description = ?,
          isActive = ?,
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        clinicName || existing.clinicName,
        clinicCode || existing.clinicCode,
        address !== undefined ? address : existing.address,
        phone !== undefined ? phone : existing.phone,
        mobile !== undefined ? mobile : existing.mobile,
        email !== undefined ? email : existing.email,
        website !== undefined ? website : existing.website,
        managerName !== undefined ? managerName : existing.managerName,
        managerPhone !== undefined ? managerPhone : existing.managerPhone,
        logo !== undefined ? logo : existing.logo,
        description !== undefined ? description : existing.description,
        isActive !== undefined ? isActive : existing.isActive,
        id
      );

      const clinic = db.prepare('SELECT * FROM tbl_clinics WHERE id = ?').get(id);

      res.json({
        message: 'اطلاعات کلینیک با موفقیت بروزرسانی شد',
        clinic
      });
    } catch (error) {
      console.error('❌ Update clinic error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی کلینیک' });
    }
  }

  // حذف کلینیک (فقط ادمین)
  static async deleteClinic(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existing = db.prepare('SELECT * FROM tbl_clinics WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'کلینیک یافت نشد' });
      }

      // بررسی اینکه آخرین کلینیک نباشد
      const count = db.prepare('SELECT COUNT(*) as count FROM tbl_clinics').get() as { count: number };
      if (count.count <= 1) {
        return res.status(400).json({ message: 'نمی‌توان آخرین کلینیک را حذف کرد' });
      }

      db.prepare('DELETE FROM tbl_clinics WHERE id = ?').run(id);

      res.json({ message: 'کلینیک با موفقیت حذف شد' });
    } catch (error) {
      console.error('❌ Delete clinic error:', error);
      res.status(500).json({ message: 'خطا در حذف کلینیک' });
    }
  }
}