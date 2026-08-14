// Path: backend/src/routes/doctor.routes.ts
import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { authenticate, isAdmin, isReceptionist, isDoctor } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای اختصاصی پزشک (پنل پزشک) =====
// ============================================

// دریافت بیماران پزشک
router.get('/patients', authenticate, isDoctor, DoctorController.getMyPatients);

// دریافت آمار پزشک
router.get('/stats', authenticate, isDoctor, DoctorController.getDoctorStats);

// ============================================
// ===== مسیرهای مدیریت پزشکان (ادمین و منشی) =====
// ============================================

// دریافت لیست همه پزشکان
router.get('/', authenticate, isReceptionist, DoctorController.getAllDoctors);

// دریافت اطلاعات یک پزشک
router.get('/:userId', authenticate, isReceptionist, DoctorController.getDoctorById);

// ایجاد پزشک جدید
router.post('/', authenticate, isAdmin, DoctorController.createDoctor);

// بروزرسانی اطلاعات پزشک
router.put('/:userId', authenticate, isAdmin, DoctorController.updateDoctor);

// حذف پزشک (غیرفعال کردن)
router.delete('/:userId', authenticate, isAdmin, DoctorController.deleteDoctor);

export default router;