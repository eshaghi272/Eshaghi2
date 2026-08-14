import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();

// اتصال همزمان به دیتابیس
const db = new Database('./estore.db');

router.get('/', (req, res) => { // async حذف شد
  try {
    const stmt = db.prepare('SELECT * FROM tbl_categories ORDER BY display_order');
    const categories = stmt.all(); // بدون await
    
    res.json({
      success: true,
      message: 'لیست دسته‌بندی‌ها',
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('خطا:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت دسته‌بندی‌ها'
    });
  }
});

export default router;