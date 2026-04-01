import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../types/schemas.js';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: {
          create: {
            position: 'Mediocampista', // Default values
            level: 'Amateur',
            foot: 'Diestro',
            height: '1.75m',
            weight: '70kg',
            age: '20',
            stats: { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50 }
          }
        }
      },
      include: { profile: true }
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (err) {
    console.error('SERVER ERROR REGISTER:', err);
    res.status(500).json({ error: 'Error al registrar usuario', details: err instanceof Error ? err.message : String(err) });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { profile: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login exitoso',
      user: { id: user.id, email: user.email, name: user.name, profile: user.profile },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
