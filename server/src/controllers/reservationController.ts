import { Response } from 'express';
import { prisma } from '../index.js';
import { AuthRequest } from '../middlewares/auth.js';
import { reservationSchema } from '../types/schemas.js';

export const getMyReservations = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

export const createReservation = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    const result = reservationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { id, court, ...data } = result.data; // Don't use the client-generated ID

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        courtName: court,
        userId: req.user.id,
        splitInfo: data.splitInfo || undefined
      }
    });

    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};
