import { Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middlewares/auth.js';
import { leagueSchema } from '../types/schemas.js';

export const getAllLeagues = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const leagues = await prisma.league.findMany({
      include: { creator: { select: { name: true, image: true } } }
    });
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ligas' });
  }
};

export const createLeague = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const result = leagueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const league = await prisma.league.create({
      data: {
        ...result.data,
        startDate: new Date(result.data.startDate),
        creatorId: req.user.id,
        status: 'Inscripciones', // Default status for new leagues
        teamsCount: `0/${result.data.maxTeams || '16'}`
      },
    });

    res.status(201).json(league);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear liga' });
  }
};

export const getLeagueById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const league = await prisma.league.findUnique({
      where: { id: id as string },
      include: { creator: { select: { name: true, image: true } } }
    });
    if (!league) return res.status(404).json({ error: 'Liga no encontrada' });
    res.json(league);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener liga' });
  }
};

export const updateLeague = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = leagueSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const league = await prisma.league.findUnique({ where: { id: id as string } });
    if (!league) return res.status(404).json({ error: 'Liga no encontrada' });
    if (league.creatorId !== req.user?.id) return res.status(403).json({ error: 'No autorizado para editar esta liga' });

    const updatedLeague = await prisma.league.update({
      where: { id: id as string },
      data: {
        ...result.data,
        startDate: result.data.startDate ? new Date(result.data.startDate) : undefined
      },
    });

    res.json(updatedLeague);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar liga' });
  }
};

export const deleteLeague = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const league = await prisma.league.findUnique({ where: { id: id as string } });
    if (!league) return res.status(404).json({ error: 'Liga no encontrada' });
    if (league.creatorId !== req.user?.id) return res.status(403).json({ error: 'No autorizado para eliminar esta liga' });

    await prisma.league.delete({ where: { id: id as string } });
    res.json({ message: 'Liga eliminada con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar liga' });
  }
};
