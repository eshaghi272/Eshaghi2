// Path: backend/src/routes/treatment.routes.ts
import { Router } from 'express';
import { TreatmentController } from '../controllers/treatment.controller';
import { authenticate, isAdmin, hasRole } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای دریافت اطلاعات (پزشک، منشی، ادمین) =====
// ============================================

// دریافت مواد مصرفی
router.get('/materials', authenticate, hasRole(['admin', 'receptionist', 'doctor']), TreatmentController.getMaterials);

// دریافت داروها
router.get('/medicines', authenticate, hasRole(['admin', 'receptionist', 'doctor']), TreatmentController.getMedicines);

// ============================================
// ===== مسیرهای مدیریت درمان (ادمین، منشی، پزشک) =====
// ============================================

// دریافت لیست درمان‌ها
router.get('/', authenticate, hasRole(['admin', 'receptionist', 'doctor']), TreatmentController.getTreatments);

// دریافت یک درمان
router.get('/:id', authenticate, hasRole(['admin', 'receptionist', 'doctor']), TreatmentController.getTreatmentById);

// ایجاد درمان جدید (پزشک، منشی، ادمین)
router.post('/', authenticate, hasRole(['admin', 'receptionist', 'doctor']), TreatmentController.createTreatment);

// ============================================
// ===== مسیرهای مدیریتی (ادمین و منشی) =====
// ============================================

// بروزرسانی درمان
router.put('/:id', authenticate, hasRole(['admin', 'receptionist']), TreatmentController.updateTreatment);

// بروزرسانی وضعیت پرداخت
router.put('/:id/payment', authenticate, hasRole(['admin', 'receptionist']), TreatmentController.updatePaymentStatus);

// حذف درمان (فقط ادمین)
router.delete('/:id', authenticate, isAdmin, TreatmentController.deleteTreatment);

// گزارشات مالی (فقط ادمین)
router.get('/financial-report', authenticate, isAdmin, TreatmentController.getFinancialReport);

export default router;