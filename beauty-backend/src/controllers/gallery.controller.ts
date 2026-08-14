// Path: backend/src/controllers/gallery.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class GalleryController {
  // ============================================
  // ===== دریافت تصاویر گالری (عمومی) =====
  // ============================================

  static async getGallery(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { category } = req.query;

      let query = `
        SELECT id, category, title, description, imageUrl, beforeImageUrl, afterImageUrl, "order"
        FROM tbl_gallery 
        WHERE clinicId = ? AND isActive = 1
      `;
      const params: any[] = [clinicId];

      if (category && category !== 'همه') {
        query += ' AND category = ?';
        params.push(category);
      }

      query += ' ORDER BY "order" ASC, createdAt DESC';

      const gallery = db.prepare(query).all(...params) as any[];
      res.json(gallery);
    } catch (error) {
      console.error('❌ Get gallery error:', error);
      res.status(500).json({ message: 'خطا در دریافت تصاویر گالری' });
    }
  }

  // ============================================
  // ===== دریافت دسته‌بندی‌ها =====
  // ============================================

  static async getCategories(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const categories = db.prepare(`
        SELECT DISTINCT category 
        FROM tbl_gallery 
        WHERE clinicId = ? AND isActive = 1
        ORDER BY category ASC
      `).all(clinicId) as any[];

      res.json(categories.map((c: any) => c.category));
    } catch (error) {
      console.error('❌ Get categories error:', error);
      res.status(500).json({ message: 'خطا در دریافت دسته‌بندی‌ها' });
    }
  }

  // ============================================
  // ===== مدیریت گالری (فقط ادمین) =====
  // ============================================

  static async createGalleryItem(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { category, title, description, imageUrl, beforeImageUrl, afterImageUrl, order } = req.body;

      if (!category || !title || !imageUrl) {
        return res.status(400).json({ message: 'دسته‌بندی، عنوان و تصویر الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_gallery (clinicId, category, title, description, imageUrl, beforeImageUrl, afterImageUrl, "order")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        clinicId,
        category,
        title,
        description || null,
        imageUrl,
        beforeImageUrl || null,
        afterImageUrl || null,
        order || 0
      );

      const item = db.prepare('SELECT * FROM tbl_gallery WHERE id = ?').get(result.lastInsertRowid) as any;

      res.status(201).json({ message: 'تصویر با موفقیت اضافه شد', item });
    } catch (error) {
      console.error('❌ Create gallery item error:', error);
      res.status(500).json({ message: 'خطا در ایجاد تصویر گالری' });
    }
  }

  static async updateGalleryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { category, title, description, imageUrl, beforeImageUrl, afterImageUrl, order, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_gallery WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'تصویر یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_gallery SET
          category = ?,
          title = ?,
          description = ?,
          imageUrl = ?,
          beforeImageUrl = ?,
          afterImageUrl = ?,
          "order" = ?,
          isActive = ?,
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `);

      stmt.run(
        category || existing.category,
        title || existing.title,
        description !== undefined ? description : existing.description,
        imageUrl || existing.imageUrl,
        beforeImageUrl !== undefined ? beforeImageUrl : existing.beforeImageUrl,
        afterImageUrl !== undefined ? afterImageUrl : existing.afterImageUrl,
        order !== undefined ? order : existing.order,
        isActive !== undefined ? isActive : existing.isActive,
        id,
        clinicId
      );

      const item = db.prepare('SELECT * FROM tbl_gallery WHERE id = ?').get(id) as any;

      res.json({ message: 'تصویر با موفقیت بروزرسانی شد', item });
    } catch (error) {
      console.error('❌ Update gallery item error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی تصویر گالری' });
    }
  }

  static async deleteGalleryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare('SELECT * FROM tbl_gallery WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'تصویر یافت نشد' });
      }

      db.prepare('DELETE FROM tbl_gallery WHERE id = ? AND clinicId = ?').run(id, clinicId);

      res.json({ message: 'تصویر با موفقیت حذف شد' });
    } catch (error) {
      console.error('❌ Delete gallery item error:', error);
      res.status(500).json({ message: 'خطا در حذف تصویر گالری' });
    }
  }
}