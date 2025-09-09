import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../models';
import { generateToken } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nickname, realName, birthDate } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { nickname }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Este email ya está registrado' : 'Este nickname ya está en uso'
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      email,
      password,
      nickname,
      realName,
      birthDate,
    });

    // Generar token
    const token = generateToken(user.id);

    // Retornar usuario sin contraseña
    const userResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      realName: user.realName,
      birthDate: user.birthDate,
      profileImage: user.profileImage,
      address: user.address,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Retornar usuario sin contraseña
    const userResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      realName: user.realName,
      birthDate: user.birthDate,
      profileImage: user.profileImage,
      address: user.address,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const userResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      realName: user.realName,
      birthDate: user.birthDate,
      profileImage: user.profileImage,
      address: user.address,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  // En una implementación más avanzada, aquí podrías invalidar el token
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
};
