import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import pkg from 'pg'; // Import pg instead of destructuring due to ESM/CJS interop
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';

import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import leagueRoutes from './routes/leagueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Para simplificar local y Easypanel, si no hay origin o incluye localhost o coincide
    if (!origin || origin.includes('localhost') || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { prisma };
