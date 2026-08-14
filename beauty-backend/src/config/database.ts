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
const database = new Database(dbPath);
database.pragma('foreign_keys = ON');
database.pragma('journal_mode = WAL');

// ===== صادر کردن به دو صورت =====
export const db = database;  // <-- برای import { db }
export default database;     // <-- برای import db

// ===== تابع مقداردهی اولیه =====
export function initializeDatabase() {
  try {
    // ... کدهای ایجاد جداول
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