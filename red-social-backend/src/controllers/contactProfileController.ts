import { Request, Response } from 'express';
import { Contact, User, Wish } from '../models';
import { Op } from 'sequelize';
import { calculateAge } from '../utils/dateUtils';

export const getContactProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { contactId } = req.params;

    // Verificar que el contacto existe y está aceptado
    const contact = await Contact.findOne({
      where: { 
        userId: user.id,
        contactId: contactId,
        status: 'accepted'
      },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate', 'address']
        }
      ]
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    const contactUser = contact.contact;
    if (!contactUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario del contacto no encontrado'
      });
    }

    // Calcular edad
    let age = null;
    if (contactUser.birthDate) {
      age = calculateAge(contactUser.birthDate);
    }

    // Obtener deseos del contacto
    const wishes = await Wish.findAll({
      where: { 
        userId: contactId
      },
      attributes: ['id', 'title', 'position'],
      order: [['position', 'ASC']]
    });

    // Obtener estadísticas de votos (por ahora mock, en el futuro se implementará)
    const positiveVotes = 0;
    const negativeVotes = 0;

    const contactProfile = {
      id: contactUser.id,
      nickname: contactUser.nickname,
      realName: contactUser.realName,
      profileImage: contactUser.profileImage,
      birthDate: contactUser.birthDate,
      age: age,
      address: contactUser.address,
      positiveVotes: positiveVotes,
      negativeVotes: negativeVotes,
      wishesCount: wishes.length,
      wishes: wishes.map(wish => ({
        id: wish.id,
        title: wish.title,
        position: wish.position
      })),
      isPublic: {
        realName: true, // Por ahora siempre true, en el futuro se implementará configuración de privacidad
        birthDate: true,
        address: true,
        wishes: true,
      }
    };

    res.json({
      success: true,
      data: contactProfile
    });
  } catch (error) {
    console.error('Error al obtener perfil de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getContactWishes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { contactId } = req.params;

    // Verificar que el contacto existe y está aceptado
    const contact = await Contact.findOne({
      where: { 
        userId: user.id,
        contactId: contactId,
        status: 'accepted'
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    // Obtener deseos del contacto
    const wishes = await Wish.findAll({
      where: { 
        userId: contactId
      },
      attributes: ['id', 'title', 'description', 'image', 'position', 'isReserved', 'reservedBy'],
      order: [['position', 'ASC']]
    });

    const contactWishes = wishes.map(wish => ({
      id: wish.id,
      title: wish.title,
      description: wish.description,
      image: wish.image,
      position: wish.position,
      isReserved: wish.isReserved || false,
      reservedBy: wish.reservedBy || null
    }));

    console.log('🎁 Deseos del contacto enviados:', contactWishes);

    res.json({
      success: true,
      data: contactWishes
    });
  } catch (error) {
    console.error('Error al obtener deseos del contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
