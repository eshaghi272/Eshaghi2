// Path: backend/src/controllers/service.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class ServiceController {
  // ========== دریافت لیست خدمات ==========
  static async getAll(req: Request, res: Response) {
    try {
      const { active } = req.query;
      let query = 'SELECT * FROM tbl_services';
      const params: any[] = [];
      
      if (active === 'true') {
        query += ' WHERE isActive = 1';
      }
      
      query += ' ORDER BY name ASC';
      
      const services = db.prepare(query).all(...params);
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
      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(id);

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
      const { name, description, price, durationMinutes, category, imageUrl } = req.body;

      if (!name || !price || !durationMinutes) {
        return res.status(400).json({ message: 'نام، قیمت و مدت زمان الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_services (name, description, price, durationMinutes, category, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        name, 
        description || null, 
        price, 
        durationMinutes, 
        category || null, 
        imageUrl || null
      );

      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(result.lastInsertRowid);
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
      const { name, description, price, durationMinutes, category, imageUrl, isActive } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'خدمت یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_services 
        SET name = ?, description = ?, price = ?, durationMinutes = ?, 
            category = ?, imageUrl = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        name || existing.name,
        description !== undefined ? description : existing.description,
        price || existing.price,
        durationMinutes || existing.durationMinutes,
        category !== undefined ? category : existing.category,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        isActive !== undefined ? isActive : existing.isActive,
        id
      );

      const service = db.prepare('SELECT * FROM tbl_services WHERE id = ?').get(id);
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
      const result = db.prepare('DELETE FROM tbl_services WHERE id = ?').run(id);

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