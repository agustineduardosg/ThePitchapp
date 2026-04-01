import { Router } from 'express';
import { getAllLeagues, createLeague, getLeagueById, updateLeague, deleteLeague } from '../controllers/leagueController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', getAllLeagues);
router.get('/:id', getLeagueById);
router.post('/', authenticate, createLeague);
router.put('/:id', authenticate, updateLeague);
router.delete('/:id', authenticate, deleteLeague);

export default router;
