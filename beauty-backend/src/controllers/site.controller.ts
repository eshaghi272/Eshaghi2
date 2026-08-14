// Path: backend/src/controllers/site.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class SiteController {
  // ============================================
  // ===== دریافت تنظیمات سایت =====
  // ============================================

  static async getSettings(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const settings = db.prepare(`
        SELECT id, key, value, type, groupName, label, description
        FROM tbl_site_settings 
        WHERE clinicId = ? AND isActive = 1
      `).all(clinicId);

      const groupedSettings: Record<string, any> = {};
      settings.forEach((setting: any) => {
        const group = setting.groupName || 'general';
        if (!groupedSettings[group]) {
          groupedSettings[group] = {};
        }
        groupedSettings[group][setting.key] = setting.value;
      });

      res.json(groupedSettings);
    } catch (error) {
      console.error('❌ Get settings error:', error);
      res.status(500).json({ message: 'خطا در دریافت تنظیمات سایت' });
    }
  }

  // ============================================
  // ===== دریافت اسلایدرها =====
  // ============================================

  static async getSliders(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const sliders = db.prepare(`
        SELECT id, title, description, imageUrl, buttonText, buttonLink, "order"
        FROM tbl_sliders 
        WHERE clinicId = ? AND isActive = 1
        ORDER BY "order" ASC
      `).all(clinicId);

      res.json(sliders);
    } catch (error) {
      console.error('❌ Get sliders error:', error);
      res.status(500).json({ message: 'خطا در دریافت اسلایدرها' });
    }
  }

  // ============================================
  // ===== دریافت ویژگی‌ها =====
  // ============================================

  static async getFeatures(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const features = db.prepare(`
        SELECT id, icon, title, description
        FROM tbl_features 
        WHERE clinicId = ? AND isActive = 1
        ORDER BY "order" ASC
      `).all(clinicId);

      res.json(features);
    } catch (error) {
      console.error('❌ Get features error:', error);
      res.status(500).json({ message: 'خطا در دریافت ویژگی‌ها' });
    }
  }

  // ============================================
  // ===== دریافت اطلاعات تماس =====
  // ============================================

  static async getContactInfo(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const contact = db.prepare(`
        SELECT id, address, phone, mobile, email, workingHours, mapUrl
        FROM tbl_contact_info 
        WHERE clinicId = ? AND isActive = 1
        ORDER BY id DESC
        LIMIT 1
      `).get(clinicId);

      res.json(contact || {});
    } catch (error) {
      console.error('❌ Get contact info error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات تماس' });
    }
  }

  // ============================================
  // ===== مدیریت اسلایدرها (فقط ادمین) =====
  // ============================================

  static async createSlider(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { title, description, imageUrl, buttonText, buttonLink, order } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'عنوان اسلایدر الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_sliders (clinicId, title, description, imageUrl, buttonText, buttonLink, "order")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        clinicId,
        title,
        description || null,
        imageUrl || null,
        buttonText || null,
        buttonLink || null,
        order || 0
      );

      const slider = db.prepare('SELECT * FROM tbl_sliders WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: 'اسلایدر با موفقیت ایجاد شد', slider });
    } catch (error) {
      console.error('❌ Create slider error:', error);
      res.status(500).json({ message: 'خطا در ایجاد اسلایدر' });
    }
  }

  static async updateSlider(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { title, description, imageUrl, buttonText, buttonLink, order, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_sliders WHERE id = ? AND clinicId = ?').get(id, clinicId);
      if (!existing) {
        return res.status(404).json({ message: 'اسلایدر یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_sliders SET
          title = ?,
          description = ?,
          imageUrl = ?,
          buttonText = ?,
          buttonLink = ?,
          "order" = ?,
          isActive = ?,
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `);

      stmt.run(
        title || existing.title,
        description !== undefined ? description : existing.description,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        buttonText !== undefined ? buttonText : existing.buttonText,
        buttonLink !== undefined ? buttonLink : existing.buttonLink,
        order !== undefined ? order : existing.order,
        isActive !== undefined ? isActive : existing.isActive,
        id,
        clinicId
      );

      const slider = db.prepare('SELECT * FROM tbl_sliders WHERE id = ?').get(id);

      res.json({ message: 'اسلایدر با موفقیت بروزرسانی شد', slider });
    } catch (error) {
      console.error('❌ Update slider error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی اسلایدر' });
    }
  }

  static async deleteSlider(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare('SELECT * FROM tbl_sliders WHERE id = ? AND clinicId = ?').get(id, clinicId);
      if (!existing) {
        return res.status(404).json({ message: 'اسلایدر یافت نشد' });
      }

      db.prepare('DELETE FROM tbl_sliders WHERE id = ? AND clinicId = ?').run(id, clinicId);

      res.json({ message: 'اسلایدر با موفقیت حذف شد' });
    } catch (error) {
      console.error('❌ Delete slider error:', error);
      res.status(500).json({ message: 'خطا در حذف اسلایدر' });
    }
  }

  // ============================================
  // ===== مدیریت ویژگی‌ها (فقط ادمین) =====
  // ============================================

  static async createFeature(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { icon, title, description, order } = req.body;

      if (!icon || !title || !description) {
        return res.status(400).json({ message: 'آیکون، عنوان و توضیحات الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_features (clinicId, icon, title, description, "order")
        VALUES (?, ?, ?, ?, ?)
      `);

      const result = stmt.run(clinicId, icon, title, description, order || 0);

      const feature = db.prepare('SELECT * FROM tbl_features WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: 'ویژگی با موفقیت ایجاد شد', feature });
    } catch (error) {
      console.error('❌ Create feature error:', error);
      res.status(500).json({ message: 'خطا در ایجاد ویژگی' });
    }
  }

  static async updateFeature(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { icon, title, description, order, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_features WHERE id = ? AND clinicId = ?').get(id, clinicId);
      if (!existing) {
        return res.status(404).json({ message: 'ویژگی یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_features SET
          icon = ?,
          title = ?,
          description = ?,
          "order" = ?,
          isActive = ?,
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `);

      stmt.run(
        icon || existing.icon,
        title || existing.title,
        description || existing.description,
        order !== undefined ? order : existing.order,
        isActive !== undefined ? isActive : existing.isActive,
        id,
        clinicId
      );

      const feature = db.prepare('SELECT * FROM tbl_features WHERE id = ?').get(id);

      res.json({ message: 'ویژگی با موفقیت بروزرسانی شد', feature });
    } catch (error) {
      console.error('❌ Update feature error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی ویژگی' });
    }
  }

  static async deleteFeature(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare('SELECT * FROM tbl_features WHERE id = ? AND clinicId = ?').get(id, clinicId);
      if (!existing) {
        return res.status(404).json({ message: 'ویژگی یافت نشد' });
      }

      db.prepare('DELETE FROM tbl_features WHERE id = ? AND clinicId = ?').run(id, clinicId);

      res.json({ message: 'ویژگی با موفقیت حذف شد' });
    } catch (error) {
      console.error('❌ Delete feature error:', error);
      res.status(500).json({ message: 'خطا در حذف ویژگی' });
    }
  }
}