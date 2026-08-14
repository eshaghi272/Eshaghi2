// Path: backend/src/routes/appointment.routes.ts
import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, AppointmentController.getAll);
router.get('/available', AppointmentController.getAvailableSlots);
router.get('/:id', authenticate, AppointmentController.getById);
router.post('/', authenticate, AppointmentController.create);
router.put('/:id', authenticate, AppointmentController.update);
router.delete('/:id', authenticate, AppointmentController.cancel);

export default router;