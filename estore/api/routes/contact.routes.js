// D:\Eshaghi\estore\api\routes\contact.route.js
import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// برای ES modules به جای __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// اتصال به دیتابیس - مسیر مطلق
const dbPath = path.join(__dirname, '..', 'estore.db');
console.log('📁 مسیر دیتابیس:', dbPath);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ اتصال به دیتابیس موفق بود');
} catch (error) {
  console.error('❌ خطا در اتصال به دیتابیس:', error);
  // در حالت خطا، از دیتابیس موقت استفاده می‌کنیم
  db = null;
}

// ==================== روت‌های عمومی ====================

// ارسال پیام تماس جدید
router.post('/', (req, res) => {
  try {
    console.log('📩 دریافت درخواست تماس:', req.body);
    
    const {
      name,
      email,
      phone,
      subject,
      message,
      category = 'general'
    } = req.body;

    // اعتبارسنجی فیلدهای ضروری
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'نام، ایمیل و پیام الزامی هستند'
      });
    }

    // اعتبارسنجی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'ایمیل معتبر نیست'
      });
    }

    // اگر دیتابیس در دسترس نباشد، پیام را لاگ می‌کنیم
    if (!db) {
      console.log('⚠️ دیتابیس در دسترس نیست، پیام فقط لاگ شد:', {
        name, email, subject, category
      });
      
      return res.status(201).json({
        success: true,
        message: 'پیام شما دریافت شد (حالت تست)',
        data: {
          id: Date.now(),
          reference_id: `TEMP-${Date.now()}`,
          estimated_response_time: '24 ساعت کاری'
        }
      });
    }

    // دریافت اطلاعات کلاینت
    const ip_address = req.ip || req.connection.remoteAddress || '';
    const user_agent = req.get('User-Agent') || '';

    // ایجاد جدول اگر وجود ندارد
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS tbl_contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT,
          message TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'general',
          status TEXT NOT NULL DEFAULT 'new',
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          admin_notes TEXT,
          is_read BOOLEAN DEFAULT 0
        )
      `);
    } catch (createError) {
      console.log('⚠️ خطا در ایجاد جدول:', createError.message);
    }

    // درج پیام در دیتابیس
    const stmt = db.prepare(`
      INSERT INTO tbl_contact_messages 
        (name, email, phone, subject, message, category, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      phone ? phone.trim() : null,
      subject ? subject.trim() : null,
      message.trim(),
      category,
      ip_address,
      user_agent
    );

    console.log('✅ پیام تماس ذخیره شد. ID:', result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد',
      data: {
        id: result.lastInsertRowid,
        reference_id: `MSG-${result.lastInsertRowid.toString().padStart(6, '0')}`,
        estimated_response_time: '24 ساعت کاری'
      }
    });

  } catch (error) {
    console.error('❌ خطا در ارسال پیام:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ارسال پیام',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// دریافت دسته‌بندی‌های تماس
router.get('/categories', (req, res) => {
  try {
    console.log('📋 دریافت دسته‌بندی‌های تماس');
    
    let categories;
    
    try {
      if (!db) throw new Error('دیتابیس در دسترس نیست');
      
      // ایجاد جدول دسته‌بندی‌ها اگر وجود ندارد
      db.exec(`
        CREATE TABLE IF NOT EXISTS tbl_contact_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          is_active BOOLEAN DEFAULT 1,
          sort_order INTEGER DEFAULT 0
        )
      `);
      
      // بررسی وجود داده
      const checkStmt = db.prepare('SELECT COUNT(*) as count FROM tbl_contact_categories');
      const countResult = checkStmt.get();
      
      if (countResult.count === 0) {
        // درج داده‌های پیش‌فرض
        const insertStmt = db.prepare(`
          INSERT INTO tbl_contact_categories (slug, name, description, icon, sort_order) 
          VALUES (?, ?, ?, ?, ?)
        `);
        
        const defaultCategories = [
          ['general', 'عمومی', 'سوالات و درخواست‌های عمومی', '💬', 1],
          ['order', 'پیگیری سفارش', 'پیگیری وضعیت سفارش‌ها', '📦', 2],
          ['return', 'بازگشت کالا', 'درخواست مرجوعی و تعویض کالا', '🔄', 3],
          ['technical', 'پشتیبانی فنی', 'مشکلات فنی و راهنمایی محصولات', '🔧', 4],
          ['business', 'همکاری تجاری', 'پیشنهادات همکاری و تجاری', '🤝', 5],
          ['complaint', 'شکایات', 'شکایات و انتقادات', '⚠️', 6]
        ];
        
        defaultCategories.forEach(cat => {
          insertStmt.run(...cat);
        });
      }
      
      const stmt = db.prepare(`
        SELECT slug, name, description, icon 
        FROM tbl_contact_categories 
        WHERE is_active = 1 
        ORDER BY sort_order, name
      `);
      categories = stmt.all();
    } catch (dbError) {
      // اگر خطا داشت، لیست پیش‌فرض را برگردان
      console.log('⚠️ خطا در خواندن از دیتابیس، استفاده از لیست پیش‌فرض');
      categories = [
        { slug: 'general', name: 'عمومی', description: 'سوالات عمومی', icon: '💬' },
        { slug: 'order', name: 'پیگیری سفارش', description: 'پیگیری سفارش‌ها', icon: '📦' },
        { slug: 'return', name: 'بازگشت کالا', description: 'مرجوعی کالا', icon: '🔄' },
        { slug: 'technical', name: 'پشتیبانی فنی', description: 'مشکلات فنی', icon: '🔧' },
        { slug: 'business', name: 'همکاری تجاری', description: 'پیشنهاد همکاری', icon: '🤝' },
        { slug: 'complaint', name: 'شکایات', description: 'شکایات و انتقادات', icon: '⚠️' }
      ];
    }

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });

  } catch (error) {
    console.error('❌ خطا در دریافت دسته‌بندی‌ها:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت دسته‌بندی‌ها'
    });
  }
});

// ==================== روت‌های ادمین ====================

// Middleware برای احراز هویت ادمین (ساده شده)
const adminAuth = (req, res, next) => {
  // برای تست، همیشه اجازه می‌دهیم
  // در حالت واقعی باید توکن JWT را بررسی کنید
  next();
};

// دریافت لیست پیام‌ها (ادمین)
router.get('/admin/messages', adminAuth, (req, res) => {
  try {
    const {
      status,
      category,
      search,
      page = 1,
      limit = 20
    } = req.query;

    console.log('📨 دریافت لیست پیام‌ها با فیلتر:', { status, category, search, page, limit });

    let messages = [];
    let total = 0;

    try {
      if (!db) throw new Error('دیتابیس در دسترس نیست');
      
      // ساخت شرط‌های WHERE
      const conditions = [];
      const params = [];

      if (status && status !== 'all') {
        conditions.push('status = ?');
        params.push(status);
      }

      if (category && category !== 'all') {
        conditions.push('category = ?');
        params.push(category);
      }

      if (search) {
        conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

      // دریافت پیام‌ها
      const query = `
        SELECT * FROM tbl_contact_messages
        ${whereClause}
        ORDER BY 
          CASE status 
            WHEN 'new' THEN 1
            WHEN 'in_progress' THEN 2
            WHEN 'read' THEN 3
            ELSE 4
          END,
          created_at DESC
        LIMIT ? OFFSET ?
      `;

      const limitNum = parseInt(limit);
      const offset = (parseInt(page) - 1) * limitNum;
      
      params.push(limitNum, offset);

      const stmt = db.prepare(query);
      messages = stmt.all(params);

      // تعداد کل
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM tbl_contact_messages
        ${whereClause}
      `;
      
      const countStmt = db.prepare(countQuery);
      const countParams = params.slice(0, params.length - 2);
      const countResult = countStmt.get(countParams);
      total = countResult ? countResult.total : 0;

    } catch (dbError) {
      console.log('⚠️ خطای دیتابیس، استفاده از داده‌های دمو');
      messages = getDemoMessages();
      total = messages.length;
    }

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('❌ خطا در دریافت پیام‌ها:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پیام‌ها'
    });
  }
});

// دریافت آمار پیام‌ها
router.get('/admin/stats', adminAuth, (req, res) => {
  try {
    console.log('📊 دریافت آمار پیام‌ها');
    
    let stats;
    
    try {
      if (!db) throw new Error('دیتابیس در دسترس نیست');
      
      // آمار کلی
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
        FROM tbl_contact_messages
      `;

      const statsStmt = db.prepare(statsQuery);
      stats = statsStmt.get();

      // آمار بر اساس دسته‌بندی
      const categoryQuery = `
        SELECT 
          category,
          COUNT(*) as count
        FROM tbl_contact_messages
        GROUP BY category
      `;

      const categoryStmt = db.prepare(categoryQuery);
      const categories = categoryStmt.all();

      // تبدیل به object
      const by_category = {};
      categories.forEach(cat => {
        by_category[cat.category] = cat.count;
      });

      stats.by_category = by_category;

    } catch (dbError) {
      console.log('⚠️ خطای دیتابیس، استفاده از آمار دمو');
      stats = {
        total: 15,
        new: 3,
        in_progress: 5,
        resolved: 7,
        by_category: {
          general: 4,
          order: 6,
          return: 3,
          technical: 1,
          business: 1
        }
      };
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ خطا در دریافت آمار:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار'
    });
  }
});

// دریافت جزئیات یک پیام
router.get('/admin/messages/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📄 دریافت جزئیات پیام ID: ${id}`);

    let message;
    
    try {
      if (!db) throw new Error('دیتابیس در دسترس نیست');
      
      // دریافت پیام
      const messageStmt = db.prepare(`
        SELECT * FROM tbl_contact_messages WHERE id = ?
      `);

      message = messageStmt.get(id);

      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'پیام یافت نشد'
        });
      }

      // بروزرسانی وضعیت به خوانده شده
      if (message.status === 'new') {
        const updateStmt = db.prepare(`
          UPDATE tbl_contact_messages 
          SET status = 'read', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `);
        updateStmt.run(id);
        message.status = 'read';
      }

    } catch (dbError) {
      console.log('⚠️ خطای دیتابیس، استفاده از داده‌های دمو');
      message = getDemoMessage(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'پیام یافت نشد'
        });
      }
    }

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('❌ خطا در دریافت جزئیات پیام:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت جزئیات پیام'
    });
  }
});

// ارسال پاسخ به پیام
router.post('/admin/messages/:id/reply', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reply_text } = req.body;

    console.log(`📤 ارسال پاسخ برای پیام ID: ${id}`, { reply_text });

    if (!reply_text?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'متن پاسخ الزامی است'
      });
    }

    if (!db) {
      console.log('⚠️ دیتابیس در دسترس نیست، پاسخ ذخیره نشد');
      
      return res.status(201).json({
        success: true,
        message: 'پاسخ ارسال شد (حالت تست)',
        data: {
          id: Date.now(),
          message_id: id,
          reply_text: reply_text.trim()
        }
      });
    }

    // بررسی وجود پیام
    const checkStmt = db.prepare('SELECT id FROM tbl_contact_messages WHERE id = ?');
    const message = checkStmt.get(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'پیام یافت نشد'
      });
    }

    // ایجاد جدول پاسخ‌ها اگر وجود ندارد
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS tbl_contact_replies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message_id INTEGER NOT NULL,
          admin_id INTEGER,
          reply_text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT 0,
          FOREIGN KEY (message_id) REFERENCES tbl_contact_messages(id) ON DELETE CASCADE
        )
      `);
    } catch (createError) {
      console.log('⚠️ خطا در ایجاد جدول پاسخ‌ها:', createError.message);
    }

    // درج پاسخ
    const replyStmt = db.prepare(`
      INSERT INTO tbl_contact_replies (message_id, reply_text)
      VALUES (?, ?)
    `);

    const replyResult = replyStmt.run(id, reply_text.trim());

    // بروزرسانی وضعیت پیام
    const updateStmt = db.prepare(`
      UPDATE tbl_contact_messages 
      SET status = 'resolved', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(id);

    console.log('✅ پاسخ ذخیره شد. ID:', replyResult.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'پاسخ با موفقیت ارسال شد',
      data: {
        id: replyResult.lastInsertRowid,
        message_id: id,
        reply_text: reply_text.trim()
      }
    });

  } catch (error) {
    console.error('❌ خطا در ارسال پاسخ:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ارسال پاسخ'
    });
  }
});

// ==================== توابع کمکی ====================

// داده‌های دمو
function getDemoMessages() {
  return [
    {
      id: 1,
      name: 'علی محمدی',
      email: 'ali@example.com',
      phone: '09121234567',
      subject: 'سفارش من کجاست؟',
      message: 'سفارش من دیروز ثبت شد اما هنوز آپدیت وضعیت ندارد.',
      category: 'order',
      status: 'new',
      created_at: '2024-12-27 10:30:00',
      updated_at: '2024-12-27 10:30:00'
    },
    {
      id: 2,
      name: 'فاطمه کریمی',
      email: 'fatemeh@example.com',
      phone: '09351234567',
      subject: 'مشکل در بازگشت کالا',
      message: 'کالایی که خریدم مشکل دارد و می‌خواهم مرجوع کنم.',
      category: 'return',
      status: 'in_progress',
      created_at: '2024-12-26 15:45:00',
      updated_at: '2024-12-26 16:30:00'
    },
    {
      id: 3,
      name: 'رضا احمدی',
      email: 'reza@example.com',
      phone: '09101234567',
      subject: 'پیشنهاد همکاری',
      message: 'سلام، می‌خواهیم با فروشگاه شما همکاری کنیم.',
      category: 'business',
      status: 'resolved',
      created_at: '2024-12-25 09:15:00',
      updated_at: '2024-12-25 14:20:00'
    }
  ];
}

function getDemoMessage(id) {
  const messages = getDemoMessages();
  const message = messages.find(m => m.id === parseInt(id));
  return message || null;
}

export default router;