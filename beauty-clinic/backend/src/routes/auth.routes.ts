// Path: backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/loginPatient', AuthController.loginPatient);
router.get('/me', authenticate, AuthController.getMe);

export default router;