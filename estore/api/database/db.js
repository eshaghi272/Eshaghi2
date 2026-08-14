// src/database/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

// تابع برای اتصال به دیتابیس
export async function connectDatabase() {
  if (!db) {
    db = await open({
      filename: './estore.db',
      driver: sqlite3.Database
    });
    
    // فعال کردن FOREIGN KEY (اگر نیاز باشد)
    await db.run('PRAGMA foreign_keys = ON');
    
    console.log('✅ Connected to database');
  }
  return db;
}

// Helper functions برای عملیات دیتابیس
export const dbHelpers = {
  // اجرای کوئری SELECT و دریافت تمام رکوردها
  all: async (sql, params = []) => {
    const database = await connectDatabase();
    return database.all(sql, params);
  },
  
  // اجر