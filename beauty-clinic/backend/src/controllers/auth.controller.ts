// Path: backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export class AuthController {
  // ثبت‌نام کاربر جدید
  static async register(req: Request, res: Response) {
    try {
      const { fullName, nationalCode, mobile, email, password, role } = req.body;

      // بررسی وجود کاربر
      const existingUser = db.prepare(
        'SELECT * FROM tbl_users WHERE nationalCode = ? OR mobile = ?'
      ).get(nationalCode, mobile);

      if (existingUser) {
        return res.status(409).json({ message: 'کاربر با این کد ملی یا موبایل قبلاً ثبت شده است' });
      }

      // هش کردن رمز عبور
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // ذخیره کاربر
      const stmt = db.prepare(`
        INSERT INTO tbl_users (fullName, nationalCode, mobile, email, passwordHash, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(fullName, nationalCode, mobile, email || null, passwordHash, role || 'patient');

      // دریافت کاربر ایجاد شده
      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive FROM tbl_users WHERE id = ?'
      ).get(result.lastInsertRowid);

      res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد', user });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'خطا در ثبت‌نام' });
    }
  }

  // ورود کاربر
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // جستجوی کاربر
      const user = db.prepare(
        'SELECT * FROM tbl_users WHERE mobile = ? OR nationalCode = ?'
      ).get(username, username) as any;

      if (!user) {
        return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ message: 'رمز عبور تنظیم نشده است' });
      }

      // بررسی رمز عبور
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
      }

      // ایجاد توکن
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // حذف passwordHash از پاسخ
      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        accessToken: token,
        tokenType: 'bearer',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'خطا در ورود' });
    }
  }

  // ورود بیمار (با موبایل و کد ملی)
  static async loginPatient(req: Request, res: Response) {
    try {
      const { mobile, nationalCode } = req.body;

      const user = db.prepare(
        'SELECT * FROM tbl_users WHERE mobile = ? AND nationalCode = ?'
      ).get(mobile, nationalCode) as any;

      if (!user) {
        return res.status(401).json({ message: 'اطلاعات وارد شده صحیح نیست' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        accessToken: token,
        tokenType: 'bearer',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Patient login error:', error);
      res.status(500).json({ message: 'خطا در ورود' });
    }
  }

  // دریافت اطلاعات کاربر جاری
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive, createdAt FROM tbl_users WHERE id = ?'
      ).get(userId);

      if (!user) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر' });
    }
  }
}