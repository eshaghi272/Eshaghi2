// Path: backend/src/routes/workingHours.routes.ts
import { Router } from 'express';
import { WorkingHoursController } from '../controllers/workingHours.controller';
import { authenticate, isAdmin, isReceptionist } from '../middleware/auth';

const router = Router();

// ========== برنامه کامل پزشک ==========
router.get('/schedule/:doctorId', authenticate, isReceptionist, WorkingHoursController.getDoctorSchedule);
router.post('/schedule/:doctorId', authenticate, isReceptionist, WorkingHoursController.saveDoctorSchedule);

// ========== روزهای کاری ==========
router.get('/working-days/:doctorId', authenticate, WorkingHoursController.getWorkingDays);
router.post('/working-days/:doctorId', authenticate, isAdmin, WorkingHoursController.setWorkingDays);

// ========== ساعت‌های کاری ==========
router.get('/working-hours/:doctorId', authenticate, WorkingHoursController.getWorkingHours);
router.post('/working-hours/:doctorId', authenticate, isAdmin, WorkingHoursController.setWorkingHours);

// ========== زمان‌های استراحت ==========
router.post('/break-time/:doctorId', authenticate, isAdmin, WorkingHoursController.setBreakTime);
router.delete('/break-time/:id', authenticate, isAdmin, WorkingHoursController.deleteBreakTime);

// ========== روزهای غیرفعال (تعطیلات) ==========
router.get('/unavailable/:doctorId', authenticate, WorkingHoursController.getUnavailableDates);
router.post('/unavailable/:doctorId', authenticate, isAdmin, WorkingHoursController.addUnavailableDate);
router.delete('/unavailable/:id', authenticate, isAdmin, WorkingHoursController.deleteUnavailableDate);

// ========== دریافت زمان‌های خالی ==========
router.get('/available-slots', WorkingHoursController.getAvailableSlotsAdvanced);

export default router;