// Path: backend/src/config/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ===== مسیر دیتابیس =====
const dbPath = process.env.DATABASE_URL 
  ? path.resolve(process.env.DATABASE_URL)
  : path.join(__dirname, '../../clinic.db');

// ===== اطمینان از وجود پوشه =====
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ===== ایجاد اتصال به دیتابیس =====
let db: Database.Database;

try {
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  console.log('✅ Database connected successfully');
} catch (error) {
  console.error('❌ Database connection error:', error);
  throw error;
}

// ===== تابع مقداردهی اولیه =====
export function initializeDatabase() {
  try {
    // ایجاد جداول بدون Foreign Key
    db.exec(`
      -- ============================================
      -- جدول کلینیک‌ها
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicName TEXT NOT NULL,
        clinicCode TEXT UNIQUE,
        address TEXT,
        phone TEXT,
        mobile TEXT,
        email TEXT,
        website TEXT,
        managerName TEXT,
        managerPhone TEXT,
        logo TEXT,
        description TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- درج کلینیک پیش‌فرض
      INSERT OR IGNORE INTO tbl_clinics (id, clinicName, clinicCode, address, phone, email)
      VALUES (1, 'کلینیک زیبایی', 'CLINIC001', 'تهران، خیابان ولیعصر، پلاک ۱۲۳', '۰۲۱-۱۲۳۴۵۶۷۸', 'info@beautyclinic.com');

      -- ============================================
      -- جدول کاربران
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        fullName TEXT NOT NULL,
        nationalCode TEXT UNIQUE,
        mobile TEXT UNIQUE,
        email TEXT,
        passwordHash TEXT,
        role TEXT DEFAULT 'patient',
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول پزشکان
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        userId INTEGER UNIQUE,
        specialty TEXT,
        biography TEXT,
        experienceYears INTEGER DEFAULT 0,
        consultationFee INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول خدمات
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        durationMinutes INTEGER NOT NULL,
        category TEXT,
        imageUrl TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول مواد مصرفی
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        name TEXT NOT NULL,
        description TEXT,
        unit TEXT NOT NULL,
        pricePerUnit INTEGER NOT NULL,
        quantity INTEGER DEFAULT 0,
        minThreshold INTEGER DEFAULT 5,
        category TEXT,
        supplier TEXT,
        fdate TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول داروها
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        name TEXT NOT NULL,
        description TEXT,
        genericName TEXT,
        brand TEXT,
        dosage TEXT,
        unit TEXT NOT NULL,
        pricePerUnit INTEGER NOT NULL,
        quantity INTEGER DEFAULT 0,
        minThreshold INTEGER DEFAULT 5,
        category TEXT,
        supplier TEXT,
        fdate TEXT,
        requiresPrescription INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول درمان‌ها
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_treatments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        patientId INTEGER NOT NULL,
        doctorId INTEGER NOT NULL,
        serviceId INTEGER NOT NULL,
        serviceName TEXT NOT NULL,
        servicePrice INTEGER NOT NULL,
        discountAmount INTEGER DEFAULT 0,
        discountPercent INTEGER DEFAULT 0,
        finalPrice INTEGER NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        totalMaterialsCost INTEGER DEFAULT 0,
        totalMedicinesCost INTEGER DEFAULT 0,
        totalExtraCosts INTEGER DEFAULT 0,
        doctorWage INTEGER DEFAULT 0,
        clinicProfit INTEGER DEFAULT 0,
        finalTotal INTEGER DEFAULT 0,
        paymentStatus TEXT DEFAULT 'pending',
        paidAmount INTEGER DEFAULT 0,
        remainingAmount INTEGER DEFAULT 0,
        paymentMethod TEXT,
        appointmentId INTEGER,
        performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول اقلام درمانی
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_treatment_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        treatmentId INTEGER NOT NULL,
        itemType TEXT NOT NULL CHECK(itemType IN ('material', 'medicine')),
        itemId INTEGER NOT NULL,
        itemName TEXT NOT NULL,
        unit TEXT,
        quantityUsed INTEGER NOT NULL,
        pricePerUnit INTEGER NOT NULL,
        totalPrice INTEGER NOT NULL,
        dosage TEXT,
        instructions TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول هزینه‌های اضافی درمان
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_treatment_extra_costs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        treatmentId INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول نوبت‌ها
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        patientId INTEGER NOT NULL,
        doctorId INTEGER NOT NULL,
        serviceId INTEGER NOT NULL,
        fdate TEXT NOT NULL,
        appointmentTime TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول موجودی انبار
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        productName TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        minThreshold INTEGER DEFAULT 5,
        unitPrice INTEGER,
        supplier TEXT,
        fdate TEXT,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول اعلان‌ها
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        appointmentId INTEGER,
        sentAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- جدول کدهای OTP
      -- ============================================
      CREATE TABLE IF NOT EXISTS tbl_otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinicId INTEGER DEFAULT 1,
        mobile TEXT NOT NULL,
        code TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        isUsed INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- ============================================
      -- ایندکس‌ها
      -- ============================================
      CREATE INDEX IF NOT EXISTS idx_clinics_code ON tbl_clinics(clinicCode);
      CREATE INDEX IF NOT EXISTS idx_clinics_active ON tbl_clinics(isActive);
      CREATE INDEX IF NOT EXISTS idx_users_clinic ON tbl_users(clinicId);
      CREATE INDEX IF NOT EXISTS idx_users_mobile ON tbl_users(mobile);
      CREATE INDEX IF NOT EXISTS idx_users_role ON tbl_users(role);
      CREATE INDEX IF NOT EXISTS idx_doctors_clinic ON tbl_doctors(clinicId);
      CREATE INDEX IF NOT EXISTS idx_doctors_user ON tbl_doctors(userId);
      CREATE INDEX IF NOT EXISTS idx_services_clinic ON tbl_services(clinicId);
      CREATE INDEX IF NOT EXISTS idx_services_active ON tbl_services(isActive);
      CREATE INDEX IF NOT EXISTS idx_materials_clinic ON tbl_materials(clinicId);
      CREATE INDEX IF NOT EXISTS idx_medicines_clinic ON tbl_medicines(clinicId);
      CREATE INDEX IF NOT EXISTS idx_treatments_clinic ON tbl_treatments(clinicId);
      CREATE INDEX IF NOT EXISTS idx_treatments_patient ON tbl_treatments(patientId);
      CREATE INDEX IF NOT EXISTS idx_treatments_doctor ON tbl_treatments(doctorId);
      CREATE INDEX IF NOT EXISTS idx_treatments_status ON tbl_treatments(status);
      CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON tbl_appointments(clinicId);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON tbl_appointments(patientId);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON tbl_appointments(doctorId);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON tbl_appointments(fdate);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON tbl_appointments(status);
      CREATE INDEX IF NOT EXISTS idx_inventory_clinic ON tbl_inventory(clinicId);
      CREATE INDEX IF NOT EXISTS idx_notifications_clinic ON tbl_notifications(clinicId);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON tbl_notifications(userId);
      CREATE INDEX IF NOT EXISTS idx_otp_clinic ON tbl_otp_codes(clinicId);
      CREATE INDEX IF NOT EXISTS idx_otp_mobile ON tbl_otp_codes(mobile);
    `);

    console.log('✅ Database initialized with all tables and indexes');
    console.log('📋 Clinic ID 1 created as default');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// ===== اجرای مقداردهی اولیه =====
try {
  initializeDatabase();
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
}

export default db;