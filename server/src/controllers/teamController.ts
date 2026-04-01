import { Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middlewares/auth.js';
import { teamSchema } from '../types/schemas.js';

export const getAllTeams = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const teams = await prisma.team.findMany({
      include: { creator: { select: { name: true, image: true } } }
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
};

export const createTeam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const result = teamSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const team = await prisma.team.create({
      data: {
        ...result.data,
        creatorId: req.user.id,
        format: result.data.format || 'Fútbol 7', // Fallback
      },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear equipo' });
  }
};

export const getTeamById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id: id as string },
      include: { creator: { select: { name: true, image: true } } }
    });
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipo' });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = teamSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const team = await prisma.team.findUnique({ where: { id: id as string } });
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });
    if (team.creatorId !== req.user?.id) return res.status(403).json({ error: 'No autorizado para editar este equipo' });

    const updatedTeam = await prisma.team.update({
      where: { id: id as string },
      data: result.data,
    });

    res.json(updatedTeam);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar equipo' });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({ where: { id: id as string } });
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });
    if (team.creatorId !== req.user?.id) return res.status(403).json({ error: 'No autorizado para eliminar este equipo' });

    await prisma.team.delete({ where: { id: id as string } });
    res.json({ message: 'Equipo eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
};
