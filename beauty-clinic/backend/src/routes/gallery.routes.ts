// Path: backend/src/routes/gallery.routes.ts
import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی =====
// ============================================

// دریافت تصاویر گالری
router.get('/', GalleryController.getGallery);

// دریافت دسته‌بندی‌ها
router.get('/categories', GalleryController.getCategories);

// ============================================
// ===== مسیرهای مدیریتی (فقط ادمین) =====
// ============================================

// ایجاد تصویر جدید
router.post('/', authenticate, isAdmin, GalleryController.createGalleryItem);

// بروزرسانی تصویر
router.put('/:id', authenticate, isAdmin, GalleryController.updateGalleryItem);

// حذف تصویر
router.delete('/:id', authenticate, isAdmin, GalleryController.deleteGalleryItem);

export default router;