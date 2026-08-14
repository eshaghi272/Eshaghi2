// Path: backend/src/controllers/service.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class ServiceController {
  // ========== دریافت لیست خدمات ==========
  static async getAll(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { active } = req.query;
      
      let query = 'SELECT * FROM tbl_services WHERE clinicId = ?';
      const params: any[] = [clinicId];
      
      if (active === 'true') {
        query += ' AND isActive = 1';
      }
      
      query += ' ORDER BY name ASC';
      
      const services = db.prepare(query).all(...params) as any[];
      res.json(services);
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست خدمات' });
    }
  }

  // ========== دریافت یک خدمت ==========
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;

      if (!service) {
        return res.status(404).json({ message: 'خدمت یافت نشد' });
      }

      res.json(service);
    } catch (error) {
      console.error('Get service error:', error);
      res.status(500).json({ message: 'خطا در دریافت خدمت' });
    }
  }

  // ========== ایجاد خدمت جدید ==========
  static async create(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { name, description, price, durationMinutes, category, imageUrl } = req.body;

      if (!name || !price || !durationMinutes) {
        return res.status(400).json({ message: 'نام، قیمت و مدت زمان الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_services (clinicId, name, description, price, durationMinutes, category, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        clinicId,
        name, 
        description || null, 
        price, 
        durationMinutes, 
        category || null, 
        imageUrl || null
      );

      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(result.lastInsertRowid) as any;
      res.status(201).json({ message: 'خدمت با موفقیت ایجاد شد', service });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ message: 'خطا در ایجاد خدمت' });
    }
  }

  // ========== بروزرسانی خدمت ==========
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { name, description, price, durationMinutes, category, imageUrl, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_services WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'خدمت یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_services 
        SET name = ?, description = ?, price = ?, durationMinutes = ?, 
            category = ?, imageUrl = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `);
      
      stmt.run(
        name || existing.name,
        description !== undefined ? description : existing.description,
        price || existing.price,
        durationMinutes || existing.durationMinutes,
        category !== undefined ? category : existing.category,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        isActive !== undefined ? isActive : existing.isActive,
        id,
        clinicId
      );

      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(id) as any;
      res.json({ message: 'خدمت با موفقیت بروزرسانی شد', service });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی خدمت' });
    }
  }

  // ========== حذف خدمت ==========
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare('SELECT * FROM tbl_services WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'خدمت یافت نشد' });
      }

      const result = db.prepare('DELETE FROM tbl_services WHERE id = ? AND clinicId = ?').run(id, clinicId);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'خدمت یافت نشد' });
      }

      res.json({ message: 'خدمت با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({ message: 'خطا در حذف خدمت' });
    }
  }
}