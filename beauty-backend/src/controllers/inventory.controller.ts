// Path: backend/src/controllers/inventory.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class InventoryController {
  // ========== دریافت لیست موجودی ==========
  static async getAll(req: Request, res: Response) {
    try {
      const { category, lowStock } = req.query;
      let query = 'SELECT * FROM tbl_inventory WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (lowStock === 'true') {
        query += ' AND quantity <= minThreshold';
      }

      query += ' ORDER BY category ASC, productName ASC';

      const items = db.prepare(query).all(...params);
      res.json(items);
    } catch (error) {
      console.error('Get inventory error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست موجودی' });
    }
  }

  // ========== دریافت یک قلم موجودی ==========
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = db.prepare('SELECT * FROM tbl_inventory WHERE id = ?').get(id);

      if (!item) {
        return res.status(404).json({ message: 'قلم موجودی یافت نشد' });
      }

      res.json(item);
    } catch (error) {
      console.error('Get inventory item error:', error);
      res.status(500).json({ message: 'خطا در دریافت قلم موجودی' });
    }
  }

  // ========== ایجاد قلم موجودی جدید ==========
  static async create(req: Request, res: Response) {
    try {
      const { 
        productName, 
        category, 
        quantity, 
        minThreshold, 
        unitPrice, 
        supplier, 
        fdate 
      } = req.body;

      if (!productName) {
        return res.status(400).json({ message: 'نام محصول الزامی است' });
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_inventory (
          productName, 
          category, 
          quantity, 
          minThreshold, 
          unitPrice, 
          supplier, 
          fdate
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        productName,
        category || null,
        quantity || 0,
        minThreshold || 5,
        unitPrice || null,
        supplier || null,
        fdate || null
      );

      const item = db.prepare('SELECT * FROM tbl_inventory WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ message: 'قلم موجودی با موفقیت اضافه شد', item });
    } catch (error) {
      console.error('Create inventory error:', error);
      res.status(500).json({ message: 'خطا در افزودن قلم موجودی' });
    }
  }

  // ========== بروزرسانی قلم موجودی ==========
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        productName, 
        category, 
        quantity, 
        minThreshold, 
        unitPrice, 
        supplier, 
        fdate 
      } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_inventory WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ message: 'قلم موجودی یافت نشد' });
      }

      const stmt = db.prepare(`
        UPDATE tbl_inventory 
        SET 
          productName = ?, 
          category = ?, 
          quantity = ?, 
          minThreshold = ?, 
          unitPrice = ?, 
          supplier = ?, 
          fdate = ?,
          lastUpdated = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        productName || existing.productName,
        category !== undefined ? category : existing.category,
        quantity !== undefined ? quantity : existing.quantity,
        minThreshold !== undefined ? minThreshold : existing.minThreshold,
        unitPrice !== undefined ? unitPrice : existing.unitPrice,
        supplier !== undefined ? supplier : existing.supplier,
        fdate !== undefined ? fdate : existing.fdate,
        id
      );

      const item = db.prepare('SELECT * FROM tbl_inventory WHERE id = ?').get(id);
      res.json({ message: 'قلم موجودی با موفقیت بروزرسانی شد', item });
    } catch (error) {
      console.error('Update inventory error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی قلم موجودی' });
    }
  }

  // ========== حذف قلم موجودی ==========
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = db.prepare('DELETE FROM tbl_inventory WHERE id = ?').run(id);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'قلم موجودی یافت نشد' });
      }

      res.json({ message: 'قلم موجودی با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete inventory error:', error);
      res.status(500).json({ message: 'خطا در حذف قلم موجودی' });
    }
  }

  // ========== دریافت دسته‌بندی‌ها ==========
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = db.prepare(`
        SELECT DISTINCT category 
        FROM tbl_inventory 
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category ASC
      `).all();

      res.json(categories.map((c: any) => c.category));
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'خطا در دریافت دسته‌بندی‌ها' });
    }
  }

  // ========== دریافت خلاصه موجودی ==========
  static async getSummary(req: Request, res: Response) {
    try {
      const summary = db.prepare(`
        SELECT 
          COUNT(*) as totalItems,
          SUM(quantity) as totalQuantity,
          COUNT(CASE WHEN quantity <= minThreshold THEN 1 END) as lowStockItems,
          COUNT(DISTINCT category) as totalCategories
        FROM tbl_inventory
      `).get();

      res.json(summary);
    } catch (error) {
      console.error('Get inventory summary error:', error);
      res.status(500).json({ message: 'خطا در دریافت خلاصه موجودی' });
    }
  }
}