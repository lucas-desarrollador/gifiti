import { Request, Response } from 'express';
import { Wish, User } from '../models';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para subir imágenes de deseos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/wishes';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wish-' + uniqueSuffix + path.extname(file.originalname));
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

export const uploadWishImage = upload.single('image');

export const getUserWishes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const wishes = await Wish.findAll({
      where: { userId: user.id },
      order: [['position', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      data: wishes
    });
  } catch (error) {
    console.error('Error al obtener deseos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserWishesById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const wishes = await Wish.findAll({
      where: { userId },
      order: [['position', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      data: wishes
    });
  } catch (error) {
    console.error('Error al obtener deseos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const addWish = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title, description, purchaseLink } = req.body;

    // Verificar que no tenga más de 10 deseos
    const wishCount = await Wish.count({ where: { userId: user.id } });
    if (wishCount >= 10) {
      return res.status(400).json({
        success: false,
        message: 'No puedes tener más de 10 deseos'
      });
    }

    // Obtener la siguiente posición
    const nextPosition = wishCount + 1;

    const wishData: any = {
      userId: user.id,
      title,
      description,
      position: nextPosition,
    };

    if (purchaseLink) {
      wishData.purchaseLink = purchaseLink;
    }

    if (req.file) {
      wishData.image = `/uploads/wishes/${req.file.filename}`;
    }

    const wish = await Wish.create(wishData);

    res.status(201).json({
      success: true,
      data: wish,
      message: 'Deseo agregado exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar deseo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateWish = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { wishId } = req.params;
    const { title, description, purchaseLink } = req.body;

    const wish = await Wish.findOne({
      where: { id: wishId, userId: user.id }
    });

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: 'Deseo no encontrado'
      });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (purchaseLink !== undefined) updateData.purchaseLink = purchaseLink;

    if (req.file) {
      updateData.image = `/uploads/wishes/${req.file.filename}`;
    }

    await wish.update(updateData);

    res.json({
      success: true,
      data: wish,
      message: 'Deseo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar deseo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteWish = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { wishId } = req.params;

    const wish = await Wish.findOne({
      where: { id: wishId, userId: user.id }
    });

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: 'Deseo no encontrado'
      });
    }

    await wish.destroy();

    res.json({
      success: true,
      message: 'Deseo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar deseo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const reorderWishes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { wishIds } = req.body;

    if (!Array.isArray(wishIds) || wishIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de IDs de deseos requerida'
      });
    }

    // Actualizar posiciones
    for (let i = 0; i < wishIds.length; i++) {
      await Wish.update(
        { position: i + 1 },
        { where: { id: wishIds[i], userId: user.id } }
      );
    }

    // Obtener deseos actualizados
    const wishes = await Wish.findAll({
      where: { userId: user.id },
      order: [['position', 'ASC']]
    });

    res.json({
      success: true,
      data: wishes,
      message: 'Deseos reordenados exitosamente'
    });
  } catch (error) {
    console.error('Error al reordenar deseos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const exploreWishes = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, sortBy = 'recent' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let order: any = [['createdAt', 'DESC']];
    if (sortBy === 'popular') {
      order = [['createdAt', 'DESC']]; // Por ahora solo por fecha
    }

    const { count, rows } = await Wish.findAndCountAll({
      where: { isReserved: false },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName', 'profileImage']
        }
      ],
      order,
      limit: Number(limit),
      offset
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
    console.error('Error al explorar deseos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
