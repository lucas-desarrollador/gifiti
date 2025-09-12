import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../models';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/profiles';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

export const uploadProfileImage = upload.single('profileImage');

// Verificar si un usuario existe por email
export const checkUserExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email requerido' 
      });
    }

    const user = await User.findOne({ 
      where: { email: email as string } 
    });

    res.json({ 
      success: true, 
      exists: !!user 
    });

  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
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
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { nickname, realName, birthDate, address, age } = req.body;

    // Verificar si el nickname ya está en uso por otro usuario
    if (nickname && nickname !== user.nickname) {
      const existingUser = await User.findOne({
        where: { nickname }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este nickname ya está en uso'
        });
      }
    }

    // Actualizar datos del usuario
    const updateData: any = {};
    if (nickname) updateData.nickname = nickname;
    if (realName) updateData.realName = realName;
    if (birthDate) updateData.birthDate = birthDate;
    if (address !== undefined) updateData.address = address;
    if (age !== undefined) updateData.age = parseInt(age);

    // Manejar imagen de perfil si se subió
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    await user.update(updateData);

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
      data: userResponse,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { nickname: { [Op.iLike]: `%${q}%` } },
          { realName: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset,
      order: [['nickname', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        data: rows,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserCount = async (req: Request, res: Response) => {
  try {
    const userCount = await User.count();
    
    res.json({ 
      success: true,
      data: {
        count: userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error al obtener contador de usuarios:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

