// Path: backend/src/routes/financial.routes.ts
import { Router } from 'express';
import { FinancialController } from '../controllers/financial.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// ===== گزارشات مالی (فقط ادمین) =====
// ============================================

// گزارش مالی جامع
router.get('/report', authenticate, isAdmin, FinancialController.getFinancialReport);

// گزارش درآمد پزشکان
router.get('/doctor-earnings', authenticate, isAdmin, FinancialController.getDoctorEarnings);

// گزارش خدمات پرفروش
router.get('/top-services', authenticate, isAdmin, FinancialController.getTopServices);

// گزارش روزانه
router.get('/daily', authenticate, isAdmin, FinancialController.getDailyReport);

export default router;