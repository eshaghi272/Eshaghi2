// Path: backend/src/routes/contact.routes.ts
import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// ===== مسیرهای عمومی =====
// ============================================

// دریافت اطلاعات تماس
router.get('/info', ContactController.getContactInfo);

// دریافت تنظیمات تماس
router.get('/settings', ContactController.getContactSettings);

// ارسال پیام تماس
router.post('/', authenticate, ContactController.sendMessage);

// ============================================
// ===== مسیرهای کاربر لاگین شده =====
// ============================================

// دریافت پیام‌های کاربر جاری
router.get('/my-messages', authenticate, ContactController.getUserMessages);

// ============================================
// ===== مسیرهای مدیریتی (فقط ادمین) =====
// ============================================

// دریافت لیست پیام‌ها
router.get('/messages', authenticate, isAdmin, ContactController.getMessages);

// بروزرسانی وضعیت پیام (خوانده شده)
router.put('/messages/:id/read', authenticate, isAdmin, ContactController.markAsRead);

// بروزرسانی وضعیت پیام
router.put('/messages/:id/status', authenticate, isAdmin, ContactController.updateMessageStatus);

// پاسخ به پیام
router.post('/messages/:id/reply', authenticate, isAdmin, ContactController.replyMessage);

export default router;