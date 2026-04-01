import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/profile', authenticate, getMyProfile);
router.put('/profile', authenticate, updateMyProfile);

export default router;
