import { Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middlewares/auth.js';
import { playerProfileSchema } from '../types/schemas.js';

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: req.user.id },
      include: { user: { select: { name: true, email: true, image: true } } }
    });

    if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const result = playerProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const updatedProfile = await prisma.playerProfile.update({
      where: { userId: req.user.id },
      data: result.data,
    });

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
