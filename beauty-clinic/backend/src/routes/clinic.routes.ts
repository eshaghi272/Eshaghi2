// Path: backend/src/routes/clinic.routes.ts
import { Router } from 'express';
import { ClinicController } from '../controllers/clinic.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی (با احراز هویت) =====
// ============================================

// دریافت اطلاعات کلینیک جاری
router.get('/current', authenticate, ClinicController.getClinic);

// ============================================
// ===== مسیرهای مدیریتی (فقط ادمین) =====
// ============================================

// دریافت لیست کلینیک‌ها
router.get('/', authenticate, isAdmin, ClinicController.getAllClinics);

// دریافت اطلاعات یک کلینیک
router.get('/:id', authenticate, isAdmin, ClinicController.getClinic);

// ایجاد کلینیک جدید
router.post('/', authenticate, isAdmin, ClinicController.createClinic);

// بروزرسانی کلینیک
router.put('/:id', authenticate, isAdmin, ClinicController.updateClinic);

// حذف کلینیک
router.delete('/:id', authenticate, isAdmin, ClinicController.deleteClinic);

export default router;