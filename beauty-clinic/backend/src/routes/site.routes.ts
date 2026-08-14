// Path: backend/src/routes/site.routes.ts
import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی =====
// ============================================

// دریافت تنظیمات سایت
router.get('/settings', SiteController.getSettings);

// دریافت اسلایدرها
router.get('/sliders', SiteController.getSliders);

// دریافت ویژگی‌ها
router.get('/features', SiteController.getFeatures);

// دریافت اطلاعات تماس
router.get('/contact', SiteController.getContactInfo);

// ============================================
// ===== مسیرهای مدیریتی (فقط ادمین) =====
// ============================================

// مدیریت اسلایدرها
router.post('/sliders', authenticate, isAdmin, SiteController.createSlider);
router.put('/sliders/:id', authenticate, isAdmin, SiteController.updateSlider);
router.delete('/sliders/:id', authenticate, isAdmin, SiteController.deleteSlider);

// مدیریت ویژگی‌ها
router.post('/features', authenticate, isAdmin, SiteController.createFeature);
router.put('/features/:id', authenticate, isAdmin, SiteController.updateFeature);
router.delete('/features/:id', authenticate, isAdmin, SiteController.deleteFeature);

export default router;