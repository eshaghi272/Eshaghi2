// Path: backend/src/routes/service.routes.ts
import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate, isAdmin, hasRole } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی (بدون احراز هویت) =====
// ============================================

// دریافت لیست خدمات (عمومی)
router.get('/public', ServiceController.getAll);

// دریافت یک خدمت (عمومی)
router.get('/public/:id', ServiceController.getById);

// ============================================
// ===== مسیرهای محافظت شده (با احراز هویت) =====
// ============================================

// دریافت لیست خدمات
router.get('/', authenticate, hasRole(['admin', 'receptionist', 'doctor']), ServiceController.getAll);

// دریافت یک خدمت
router.get('/:id', authenticate, hasRole(['admin', 'receptionist', 'doctor']), ServiceController.getById);

// ایجاد خدمت جدید
router.post('/', authenticate, hasRole(['admin', 'receptionist']), ServiceController.create);

// بروزرسانی خدمت
router.put('/:id', authenticate, hasRole(['admin', 'receptionist']), ServiceController.update);

// حذف خدمت (فقط ادمین)
router.delete('/:id', authenticate, isAdmin, ServiceController.delete);

export default router;