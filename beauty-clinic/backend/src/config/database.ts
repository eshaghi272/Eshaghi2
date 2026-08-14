// Path: backend/src/config/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// مسیر دیتابیس
const dbPath = process.env.DATABASE_URL 
  ? path.resolve(process.env.DATABASE_URL)
  : path.join(__dirname, '../../database.sqlite');

// اطمینان از وجود پوشه دیتابیس
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ایجاد اتصال به دیتابیس
export const db = new Database(dbPath);

// فعال‌سازی Foreign Keys
db.pragma('foreign_keys = ON');

// ایجاد جداول در صورت عدم وجود
export function initializeDatabase() {
  // ... (کدهای ایجاد جداول شما)
}