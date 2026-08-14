// Path: backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

// ============================================
// انواع داده
// ============================================

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
      clinicId?: number;
    }
  }
}

interface JwtPayload {
  id: number;
  role: string;
  clinicId: number;
}

// ============================================
// Middleware احراز هویت
// ============================================

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.userId = decoded.id;
      
      const user = db.prepare('SELECT * FROM tbl_users WHERE id = ? AND isActive = 1').get(decoded.id) as any;
      if (!user) {
        console.log(`❌ User not found: ${decoded.id}`);
        return res.status(401).json({ message: 'کاربر یافت نشد' });
      }
      
      req.user = user;
      req.clinicId = user.clinicId || 1;
      
      console.log(`✅ Authenticated: ${user.id} - ${user.fullName} (${user.role})`);
      
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error);
      return res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده' });
    }
  } catch (error) {
    console.log('❌ Authentication error:', error);
    return res.status(500).json({ message: 'خطا در احراز هویت' });
  }
};

// ============================================
// Middleware بررسی نقش‌ها
// ============================================

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    
    console.log(`🔍 isAdmin: user role = "${req.user.role}"`);
    
    if (req.user.role !== 'admin') {
      console.log(`❌ isAdmin failed: expected "admin", got "${req.user.role}"`);
      return res.status(403).json({ message: 'دسترسی فقط برای مدیر' });
    }
    
    console.log(`✅ isAdmin passed`);
    next();
  } catch (error) {
    console.error('❌ isAdmin error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const isDoctor = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      console.log('❌ isDoctor: No user in request');
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    
    console.log(`🔍 isDoctor: user.id = ${req.user.id}`);
    console.log(`🔍 isDoctor: user.role = "${req.user.role}"`);
    console.log(`🔍 isDoctor: user.fullName = "${req.user.fullName}"`);
    console.log(`🔍 isDoctor: user.isActive = ${req.user.isActive}`);
    
    const userRole = req.user.role?.trim()?.toLowerCase();
    console.log(`🔍 isDoctor: normalized role = "${userRole}"`);
    
    if (userRole !== 'doctor') {
      console.log(`❌ isDoctor failed: expected "doctor", got "${userRole}"`);
      return res.status(403).json({ 
        message: 'دسترسی فقط برای پزشکان',
        debug: { role: req.user.role, normalized: userRole }
      });
    }
    
    console.log(`✅ isDoctor passed for user ${req.user.id}`);
    next();
  } catch (error) {
    console.error('❌ isDoctor error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const isReceptionist = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    
    const userRole = req.user.role?.trim()?.toLowerCase();
    console.log(`🔍 isReceptionist: user role = "${userRole}"`);
    
    if (userRole !== 'receptionist' && userRole !== 'admin') {
      console.log(`❌ isReceptionist failed: expected "receptionist" or "admin", got "${userRole}"`);
      return res.status(403).json({ message: 'دسترسی فقط برای منشی' });
    }
    
    console.log(`✅ isReceptionist passed`);
    next();
  } catch (error) {
    console.error('❌ isReceptionist error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const isPatient = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    
    const userRole = req.user.role?.trim()?.toLowerCase();
    console.log(`🔍 isPatient: user role = "${userRole}"`);
    
    if (userRole !== 'patient') {
      console.log(`❌ isPatient failed: expected "patient", got "${userRole}"`);
      return res.status(403).json({ message: 'دسترسی فقط برای بیماران' });
    }
    
    console.log(`✅ isPatient passed`);
    next();
  } catch (error) {
    console.error('❌ isPatient error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'احراز هویت لازم است' });
      }
      
      const userRole = req.user.role?.trim()?.toLowerCase();
      console.log(`🔍 hasRole: user role = "${userRole}", allowed = ${roles.join(', ')}`);
      
      if (userRole === 'admin') {
        console.log(`✅ hasRole: admin access granted`);
        return next();
      }
      
      if (!roles.includes(userRole)) {
        console.log(`❌ hasRole failed: "${userRole}" not in [${roles.join(', ')}]`);
        return res.status(403).json({ message: 'دسترسی غیرمجاز' });
      }
      
      console.log(`✅ hasRole passed`);
      next();
    } catch (error) {
      console.error('❌ hasRole error:', error);
      return res.status(500).json({ message: 'خطا در دسترسی' });
    }
  };
};

// ============================================
// ===== بررسی مالکیت =====
// ============================================

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id) || parseInt(req.params.userId);
    
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'شما دسترسی به این داده ندارید' });
    }

    next();
  } catch (error) {
    console.error('❌ isOwner error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

// ============================================
// ===== بررسی دسترسی به کلینیک =====
// ============================================

export const hasClinicAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const clinicId = parseInt(req.params.clinicId) || 
                     parseInt(req.body.clinicId) || 
                     parseInt(req.query.clinicId as string) || 
                     1;

    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.clinicId !== clinicId) {
      return res.status(403).json({ message: 'شما به این کلینیک دسترسی ندارید' });
    }

    next();
  } catch (error) {
    console.error('❌ hasClinicAccess error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

// ============================================
// ===== بررسی نقش‌های ترکیبی =====
// ============================================

export const isDoctorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    const userRole = req.user.role?.trim()?.toLowerCase();
    if (userRole !== 'doctor' && userRole !== 'admin') {
      return res.status(403).json({ message: 'دسترسی فقط برای پزشکان و مدیران' });
    }
    next();
  } catch (error) {
    console.error('❌ isDoctorOrAdmin error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const isReceptionistOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    const userRole = req.user.role?.trim()?.toLowerCase();
    if (userRole !== 'receptionist' && userRole !== 'admin') {
      return res.status(403).json({ message: 'دسترسی فقط برای منشی و مدیران' });
    }
    next();
  } catch (error) {
    console.error('❌ isReceptionistOrAdmin error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

export const isPatientOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }
    const userRole = req.user.role?.trim()?.toLowerCase();
    if (userRole !== 'patient' && userRole !== 'admin') {
      return res.status(403).json({ message: 'دسترسی فقط برای بیماران و مدیران' });
    }
    next();
  } catch (error) {
    console.error('❌ isPatientOrAdmin error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};

// ============================================
// ===== بررسی دسترسی به کاربر خاص =====
// ============================================

export const canAccessUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = parseInt(req.params.id) || parseInt(req.params.userId);
    
    if (!req.user) {
      return res.status(401).json({ message: 'احراز هویت لازم است' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if ((req.user.role === 'receptionist' || req.user.role === 'doctor') && req.user.clinicId) {
      const targetUser = db.prepare('SELECT clinicId, role FROM tbl_users WHERE id = ?').get(targetUserId) as any;
      if (targetUser && targetUser.clinicId === req.user.clinicId) {
        return next();
      }
    }

    if (req.user.id === targetUserId) {
      return next();
    }

    return res.status(403).json({ message: 'شما دسترسی به این کاربر ندارید' });
  } catch (error) {
    console.error('❌ canAccessUser error:', error);
    return res.status(500).json({ message: 'خطا در دسترسی' });
  }
};