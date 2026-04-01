import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string(),
});

export const statsSchema = z.object({
  pace: z.number().min(0).max(100),
  shooting: z.number().min(0).max(100),
  passing: z.number().min(0).max(100),
  dribbling: z.number().min(0).max(100),
  defending: z.number().min(0).max(100),
  physical: z.number().min(0).max(100),
});

export const playerProfileSchema = z.object({
  position: z.string(),
  level: z.string(),
  foot: z.string(),
  height: z.string().regex(/^\d+(\.\d+)?m$/, "Formato inválido (ej: 1.78m)"),
  weight: z.string().regex(/^\d+kg$/, "Formato inválido (ej: 75kg)"),
  age: z.string().regex(/^\d+$/, "Debe ser un número"),
  stats: statsSchema,
});

export const reservationSchema = z.object({
  id: z.string().optional(),
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
  }).nullable().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(3, "El nombre del equipo debe tener al menos 3 caracteres"),
  region: z.string(),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  format: z.string(),
  level: z.string(),
  image: z.string().url(),
  tags: z.array(z.string()).optional(),
});

export const leagueSchema = z.object({
  name: z.string().min(5, "El nombre de la liga debe tener al menos 5 caracteres"),
  region: z.string(),
  startDate: z.string(),
  prize: z.string(),
  maxTeams: z.string().optional(),
  fee: z.string(),
  description: z.string().min(10, "La descripción debe ser más detallada"),
  format: z.string().optional(),
  rules: z.string().optional(),
});
