// Path: backend/src/routes/inventory.routes.ts
import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticate, isAdmin, isReceptionist } from '../middleware/auth';

const router = Router();

// مسیرهای عمومی (مشاهده)
router.get('/', authenticate, isReceptionist, InventoryController.getAll);
router.get('/categories', authenticate, isReceptionist, InventoryController.getCategories);
router.get('/summary', authenticate, isReceptionist, InventoryController.getSummary);
router.get('/:id', authenticate, isReceptionist, InventoryController.getById);

// مسیرهای مدیریتی (افزودن، ویرایش، حذف)
router.post('/', authenticate, isAdmin, InventoryController.create);
router.put('/:id', authenticate, isAdmin, InventoryController.update);
router.delete('/:id', authenticate, isAdmin, InventoryController.delete);

export default router;