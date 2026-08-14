// Path: backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { fullName, nationalCode, mobile, email, password, role } = req.body;

      const existingUser = db.prepare(
        'SELECT * FROM tbl_users WHERE nationalCode = ? OR mobile = ?'
      ).get(nationalCode, mobile) as any;

      if (existingUser) {
        return res.status(409).json({ message: 'کاربر با این کد ملی یا موبایل قبلاً ثبت شده است' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const stmt = db.prepare(`
        INSERT INTO tbl_users (fullName, nationalCode, mobile, email, passwordHash, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(fullName, nationalCode, mobile, email || null, passwordHash, role || 'patient');

      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive FROM tbl_users WHERE id = ?'
      ).get(result.lastInsertRowid) as any;

      res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد', user });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'خطا در ثبت‌نام' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = db.prepare(
        'SELECT * FROM tbl_users WHERE mobile = ? OR nationalCode = ?'
      ).get(username, username) as any;

      if (!user) {
        return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ message: 'رمز عبور تنظیم نشده است' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
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
      console.error('Login error:', error);
      res.status(500).json({ message: 'خطا در ورود' });
    }
  }

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

  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const user = db.prepare(
        'SELECT id, fullName, nationalCode, mobile, email, role, isActive, createdAt FROM tbl_users WHERE id = ?'
      ).get(userId) as any;

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