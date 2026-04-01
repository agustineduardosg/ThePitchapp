import { Router } from 'express';
import { getMyReservations, createReservation } from '../controllers/reservationController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, getMyReservations);
router.post('/', authenticate, createReservation);

export default router;
