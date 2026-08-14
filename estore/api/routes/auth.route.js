// routes/auth.routes.js
import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// اتصال به دیتابیس SQLite با مسیر صحیح
// مسیر دیتابیس: از پوشه routes به پوشه اصلی پروژه برویم
const dbPath = path.join(__dirname, '..', 'estore.db');
console.log(`📁 Connecting to database at: ${dbPath}`);

const db = new Database(dbPath);

// توابع اعتبارسنجی
const validateNationalCode = (code) => {
  if (!code || code.length !== 10 || !/^\d{10}$/.test(code)) {
    return false;
  }
  
  const check = parseInt(code[9]);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  const isValid = (remainder < 2 && check === remainder) || 
                  (remainder >= 2 && check === 11 - remainder);
  
  return isValid;
};

const validatePhoneNumber = (phone) => {
  const regex = /^09[0-9]{9}$/;
  return regex.test(phone);
};

// روت ثبت‌نام
router.post('/register', (req, res) => {
  try {
    const { national_code, phone, full_name, email } = req.body;
    
    console.log('📝 درخواست ثبت‌نام:', { national_code, phone, full_name });
    
    // اعتبارسنجی ورودی‌ها
    if (!national_code || !phone || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'کد ملی، شماره تلفن و نام کامل الزامی هستند'
      });
    }
    
    // اعتبارسنجی کد ملی
    if (!validateNationalCode(national_code)) {
      return res.status(400).json({
        success: false,
        error: 'کد ملی معتبر نیست (فرمت: 10 رقم)'
      });
    }
    
    // اعتبارسنجی شماره تلفن
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'شماره تلفن معتبر نیست (فرمت: 09123456789)'
      });
    }
    
    // بررسی تکراری نبودن
    const checkPhone = db.prepare('SELECT id FROM tbl_users WHERE phone = ?').get(phone);
    if (checkPhone) {
      return res.status(400).json({
        success: false,
        error: 'این شماره تلفن قبلاً ثبت شده است'
      });
    }
    
    const checkNationalCode = db.prepare('SELECT id FROM tbl_users WHERE national_code = ?').get(national_code);
    if (checkNationalCode) {
      return res.status(400).json({
        success: false,
        error: 'این کد ملی قبلاً ثبت شده است'
      });
    }
    
    // تولید کد تأیید
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 دقیقه
    
    // درج کاربر در دیتابیس
    const stmt = db.prepare(`
      INSERT INTO tbl_users (
        phone, full_name, national_code, 
        verification_code, code_expires_at, 
        is_verified, verification_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      phone,
      full_name,
      national_code,
      verificationCode,
      expiresAt,
      0, // is_verified = false
      'sms'
    );
    
    console.log('✅ کاربر ثبت شد با ID:', result.lastInsertRowid);
    
    res.json({
      success: true,
      message: 'ثبت‌نام موفقیت‌آمیز بود',
      data: {
        user_id: result.lastInsertRowid,
        phone: phone,
        national_code: national_code,
        full_name: full_name,
        verification_code: verificationCode, // فقط برای تست - در حالت واقعی ارسال نمی‌شود
        code_expires_at: expiresAt,
        is_verified: false
      },
      note: 'کد تأیید به شماره شما ارسال شد (در حالت تست در پاسخ نمایش داده می‌شود)'
    });
    
  } catch (error) {
    console.error('❌ خطا در ثبت‌نام:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        error: 'این شماره تلفن یا کد ملی قبلاً ثبت شده است'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت‌نام. لطفا مجدداً تلاش کنید.'
    });
  }
});

// روت تأیید کد
router.post('/verify', (req, res) => {
  try {
    const { phone, national_code, verification_code } = req.body;
    
    console.log('🔐 درخواست تأیید کد:', { phone, national_code });
    
    if (!phone || !national_code || !verification_code) {
      return res.status(400).json({
        success: false,
        error: 'شماره تلفن، کد ملی و کد تأیید الزامی هستند'
      });
    }
    
    // دریافت کاربر
    const stmt = db.prepare(`
      SELECT * FROM tbl_users 
      WHERE phone = ? AND national_code = ? AND is_verified = 0
    `);
    const user = stmt.get(phone, national_code);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد یا قبلاً تأیید شده است'
      });
    }
    
    // بررسی انقضای کد
    const now = new Date();
    const expiryDate = new Date(user.code_expires_at);
    
    if (now > expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'کد تأیید منقضی شده است'
      });
    }
    
    // بررسی صحت کد
    if (user.verification_code !== verification_code) {
      return res.status(400).json({
        success: false,
        error: 'کد تأیید صحیح نیست'
      });
    }
    
    // آپدیت وضعیت کاربر به تأیید شده
    const updateStmt = db.prepare(`
      UPDATE tbl_users 
      SET is_verified = 1, 
          verification_code = NULL,
          code_expires_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(user.id);
    
    // ایجاد توکن (در حالت واقعی JWT)
    const token = `fake-jwt-token-${user.id}`;
    
    console.log('✅ کد تأیید شد برای کاربر:', user.id);
    
    res.json({
      success: true,
      message: 'کد تأیید صحیح است. حساب کاربری فعال شد.',
      data: {
        user_id: user.id,
        phone: user.phone,
        national_code: user.national_code,
        full_name: user.full_name,
        is_verified: true,
        created_at: user.created_at
      },
      token: token
    });
    
  } catch (error) {
    console.error('❌ خطا در تأیید کد:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تأیید کد. لطفا مجدداً تلاش کنید.'
    });
  }
});

// روت لاگین
router.post('/login', (req, res) => {
  try {
    const { phone, national_code } = req.body;
    
    console.log('🔑 درخواست ورود:', { phone, national_code });
    
    if (!phone || !national_code) {
      return res.status(400).json({
        success: false,
        error: 'شماره تلفن و کد ملی الزامی هستند'
      });
    }
    
    // جستجوی کاربر تأیید شده
    const stmt = db.prepare(`
      SELECT * FROM tbl_users 
      WHERE phone = ? AND national_code = ? AND is_verified = 1
    `);
    const user = stmt.get(phone, national_code);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد یا حساب تأیید نشده است'
      });
    }
    
    // ایجاد توکن
    const token = `fake-jwt-token-${user.id}`;
    
    console.log('✅ ورود موفق برای کاربر:', user.id);
    
    res.json({
      success: true,
      message: 'ورود موفق',
      data: {
        user_id: user.id,
        phone: user.phone,
        national_code: user.national_code,
        full_name: user.full_name,
        is_verified: true,
        created_at: user.created_at
      },
      token: token
    });
    
  } catch (error) {
    console.error('❌ خطا در ورود:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ورود. لطفا مجدداً تلاش کنید.'
    });
  }
});

// روت ارسال مجدد کد
router.post('/resend-code', (req, res) => {
  try {
    const { phone, national_code } = req.body;
    
    if (!phone || !national_code) {
      return res.status(400).json({
        success: false,
        error: 'شماره تلفن و کد ملی الزامی هستند'
      });
    }
    
    // بررسی وجود کاربر
    const userStmt = db.prepare(`
      SELECT * FROM tbl_users 
      WHERE phone = ? AND national_code = ? AND is_verified = 0
    `);
    const user = userStmt.get(phone, national_code);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }
    
    // تولید کد جدید
    const newVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newExpiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    
    // آپدیت کد
    const updateStmt = db.prepare(`
      UPDATE tbl_users 
      SET verification_code = ?,
          code_expires_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(newVerificationCode, newExpiresAt, user.id);
    
    res.json({
      success: true,
      message: 'کد جدید ارسال شد',
      data: {
        verification_code: newVerificationCode, // فقط برای تست
        code_expires_at: newExpiresAt
      },
      note: 'کد جدید به شماره شما ارسال شد'
    });
    
  } catch (error) {
    console.error('Error in resend-code route:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ارسال مجدد کد. لطفا مجدداً تلاش کنید.'
    });
  }
});

// روت سلامت سیستم
router.get('/health', (req, res) => {
  try {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM tbl_users');
    const result = stmt.get();
    
    res.json({
      success: true,
      database: 'connected',
      tables: {
        users_count: result.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

// روت تست
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is working',
    endpoints: {
      register: 'POST /api/auth/register',
      verify: 'POST /api/auth/verify',
      login: 'POST /api/auth/login',
      resend_code: 'POST /api/auth/resend-code',
      health: 'GET /api/auth/health'
    }
  });
});

export default router;