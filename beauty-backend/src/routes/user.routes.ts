// Path: backend/src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, isAdmin, isReceptionist, hasRole } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی برای کاربر جاری (همه نقش‌ها) =====
// ============================================

// دریافت اطلاعات کاربر جاری
router.get('/me', authenticate, UserController.getMe);

// بروزرسانی اطلاعات کاربر جاری
router.put('/me', authenticate, UserController.updateMe);

// ============================================
// ===== مسیرهای مدیریتی (منشی و ادمین) =====
// ============================================

// دریافت لیست کاربران
router.get('/', authenticate, hasRole(['admin', 'receptionist']), UserController.getAll);

// ایجاد کاربر جدید
router.post('/', authenticate, hasRole(['admin', 'receptionist']), UserController.create);

// دریافت یک کاربر
router.get('/:id', authenticate, hasRole(['admin', 'receptionist']), UserController.getById);

// بروزرسانی کاربر
router.put('/:id', authenticate, hasRole(['admin', 'receptionist']), UserController.update);

// حذف کاربر (فقط ادمین)
router.delete('/:id', authenticate, isAdmin, UserController.delete);

export default router;