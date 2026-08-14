import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();

// اتصال همزمان به دیتابیس (بدون async)
const db = new Database('./estore.db');

// تابع getDatabase حذف می‌شود. مستقیم از db استفاده می‌کنیم

router.get('/', (req, res) => { // async حذف شد
  try {
    // استفاده از متد prepare و all به صورت همزمان
    const stmt = db.prepare('SELECT * FROM tbl_products ORDER BY id');
    const products = stmt.all(); // بدون await
    
    res.json({
      success: true,
      message: 'لیست محصولات',
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('خطا:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت محصولات'
    });
  }
});

router.get('/:id', (req, res) => { // async حذف شد
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM tbl_products WHERE id = ?');
    const product = stmt.get(id); // بدون await
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'محصول یافت نشد'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('خطا:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت محصول'
    });
  }
});

export default router;