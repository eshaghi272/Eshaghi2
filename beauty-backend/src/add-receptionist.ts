// Path: backend/add-receptionist.ts
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(__dirname, 'clinic.db');
const db = new Database(dbPath);

async function addReceptionist() {
  try {
    // هش کردن رمز عبور
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('receptionist123', salt);

    // بررسی وجود کاربر
    const existing = db.prepare(
      'SELECT * FROM tbl_users WHERE mobile = ? OR nationalCode = ?'
    ).get('09120000012', '1234567899');

    if (existing) {
      console.log('⚠️ کاربر منشی قبلاً وجود دارد');
      console.log('📱 موبایل:', (existing as any).mobile);
      console.log('👤 نام:', (existing as any).fullName);
      return;
    }

    // درج کاربر
    const stmt = db.prepare(`
      INSERT INTO tbl_users (
        fullName, 
        nationalCode, 
        mobile, 
        email, 
        passwordHash, 
        role, 
        isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      'منشی کلینیک',
      '1234567899',
      '09120000012',
      'receptionist@clinic.com',
      passwordHash,
      'receptionist',
      1
    );

    console.log('✅ کاربر منشی با موفقیت ایجاد شد!');
    console.log('📝 ID:', result.lastInsertRowid);
    console.log('📱 موبایل: 09120000012');
    console.log('🔑 رمز عبور: receptionist123');
    console.log('👤 نقش: منشی');

    // نمایش لیست کاربران منشی
    const receptionists = db.prepare('SELECT * FROM tbl_users WHERE role = "receptionist"').all();
    console.log('\n📋 لیست منشی‌ها:');
    receptionists.forEach((r: any) => {
      console.log(`  👤 ${r.fullName} - ${r.mobile}`);
    });

  } catch (error) {
    console.error('❌ خطا:', error);
  }
}

addReceptionist();