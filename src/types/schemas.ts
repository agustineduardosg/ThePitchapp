import { z } from 'zod';

export const statsSchema = z.object({
  pace: z.number().min(0).max(100),
  shooting: z.number().min(0).max(100),
  passing: z.number().min(0).max(100),
  dribbling: z.number().min(0).max(100),
  defending: z.number().min(0).max(100),
  physical: z.number().min(0).max(100),
});

export const playerProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  position: z.string(),
  level: z.string(),
  foot: z.string(),
  height: z.string().regex(/^\d+(\.\d+)?m$/, "Formato inválido (ej: 1.78m)"),
  weight: z.string().regex(/^\d+kg$/, "Formato inválido (ej: 75kg)"),
  age: z.string().regex(/^\d+$/, "Debe ser un número"),
  stats: statsSchema,
});

export const teamSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "El nombre del equipo debe tener al menos 3 caracteres"),
  region: z.string(),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  format: z.string(),
  level: z.string(),
  members: z.number().int().min(1),
  wins: z.number().int().min(0),
  losses: z.number().int().min(0).optional(),
  draws: z.number().int().min(0).optional(),
  rating: z.string().optional(),
  image: z.string().url(),
  tags: z.array(z.string()).optional(),
});

export const leagueSchema = z.object({
  id: z.string(),
  name: z.string().min(5, "El nombre de la liga debe tener al menos 5 caracteres"),
  region: z.string(),
  teams: z.string(), // e.g. "24/32"
  status: z.enum(['Activa', 'Inscripciones', 'Finalizada']),
  startDate: z.string(),
  prize: z.string(),
  maxTeams: z.string().optional(),
  fee: z.string(),
  description: z.string().min(10, "La descripción debe ser más detallada"),
  format: z.string().optional(),
  rules: z.string().optional(),
});

export const courtSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  rating: z.number(),
  reviews: z.number(),
  price: z.string(),
  surface: z.string(),
  lighting: z.string(),
  city: z.string(),
  distance: z.string().optional(),
  sports: z.array(z.string()),
  image: z.string().url(),
  schedule: z.string(),
  features: z.array(z.string()),
});

export const matchSchema = z.object({
  id: z.string(),
  leagueId: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['Programado', 'En Curso', 'Finalizado']),
});

export const reservationSchema = z.object({
  id: z.string(),
  court: z.string(),
  date: z.string(),
  price: z.string(),
  status: z.enum(['Confirmada', 'Pendiente', 'Cancelada']),
  image: z.string().url(),
  type: z.enum(['Individual', 'Dividido']),
  splitInfo: z.object({
    totalParticipants: z.number(),
    paidParticipants: z.number(),
    amountPerPerson: z.number(),
    participants: z.array(z.object({
      name: z.string(),
      status: z.enum(['Pagado', 'Pendiente']),
      isOrganizer: z.boolean(),
    })),
  }).nullable(),
});

export const challengeSchema = z.object({
  id: z.string(),
  challengerId: z.string(),
  challengedId: z.string(),
  status: z.enum(['Pendiente', 'Aceptado', 'Rechazado']),
  date: z.string(),
  time: z.string(),
  court: z.string(),
});

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  time: z.string(),
  read: z.boolean(),
  type: z.enum(['challenge', 'reservation', 'info', 'league']),
  actionData: z.any().optional(),
  actionTaken: z.string().optional(),
});

export const standingSchema = z.object({
  id: z.string(),
  leagueId: z.string(),
  teamName: z.string(),
  pj: z.number().int().min(0),
  g: z.number().int().min(0),
  e: z.number().int().min(0),
  p: z.number().int().min(0),
  gf: z.number().int().min(0),
  gc: z.number().int().min(0),
  dg: z.number().int(),
  pts: z.number().int().min(0),
});
