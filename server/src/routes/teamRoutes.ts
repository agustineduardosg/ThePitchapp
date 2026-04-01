import { Router } from 'express';
import { getAllTeams, createTeam, getTeamById, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', authenticate, createTeam);
router.put('/:id', authenticate, updateTeam);
router.delete('/:id', authenticate, deleteTeam);

export default router;
