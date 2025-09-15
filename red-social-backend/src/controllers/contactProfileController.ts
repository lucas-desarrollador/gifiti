import { Request, Response } from 'express';
import { Contact, User, Wish, PrivacySettings } from '../models';
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
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate', 'email', 'city', 'province', 'country', 'postalAddress'],
          include: [
            {
              model: PrivacySettings,
              as: 'privacySettings',
              required: false // LEFT JOIN para incluir usuarios sin configuraciones
            }
          ]
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

    // Obtener configuraciones de privacidad del contacto
    const privacySettings = contactUser.privacySettings;
    
    // Valores por defecto si no hay configuraciones
    const defaultPrivacy = {
      showAge: true,
      showEmail: false,
      showAllWishes: false,
      showContactsList: false,
      showMutualFriends: true,
      showLocation: true,
      showPostalAddress: false,
      isPublicProfile: true
    };

    const privacy = privacySettings || defaultPrivacy;

    // Calcular edad solo si está permitido
    let age = null;
    if (privacy.showAge && contactUser.birthDate) {
      age = calculateAge(contactUser.birthDate);
    }

    // Obtener deseos del contacto
    const wishesQuery: any = {
      where: { 
        userId: contactId
      },
      attributes: ['id', 'title', 'position'],
      order: [['position', 'ASC']]
    };

    // Si no se permite mostrar todos los deseos, solo mostrar el #1
    if (!privacy.showAllWishes) {
      wishesQuery.where.position = 1;
    }

    const wishes = await Wish.findAll(wishesQuery);

    // Obtener estadísticas de votos (por ahora mock, en el futuro se implementará)
    const positiveVotes = 0;
    const negativeVotes = 0;

    // Construir perfil respetando configuraciones de privacidad
    const contactProfile: any = {
      id: contactUser.id,
      nickname: contactUser.nickname,
      realName: contactUser.realName,
      profileImage: contactUser.profileImage,
      positiveVotes: positiveVotes,
      negativeVotes: negativeVotes,
      wishesCount: wishes.length,
      wishes: wishes.map(wish => ({
        id: wish.id,
        title: wish.title,
        position: wish.position
      })),
      // Agregar campos condicionalmente según configuraciones de privacidad
      ...(privacy.showAge && { 
        birthDate: contactUser.birthDate,
        age: age 
      }),
      ...(privacy.showEmail && { 
        email: contactUser.email 
      }),
      ...(privacy.showLocation && { 
        city: contactUser.city,
        province: contactUser.province,
        country: contactUser.country
      }),
      ...(privacy.showPostalAddress && { 
        postalAddress: contactUser.postalAddress 
      }),
      isPublic: {
        realName: true, // Por ahora siempre true, en el futuro se implementará configuración de privacidad
        birthDate: privacy.showAge,
        email: privacy.showEmail,
        location: privacy.showLocation,
        postalAddress: privacy.showPostalAddress,
        wishes: privacy.showAllWishes,
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
      },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id'],
          include: [
            {
              model: PrivacySettings,
              as: 'privacySettings',
              required: false
            }
          ]
        }
      ]
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    // Obtener configuraciones de privacidad del contacto
    const privacySettings = contact.contact?.privacySettings;
    const defaultPrivacy = {
      showAllWishes: false
    };
    const privacy = privacySettings || defaultPrivacy;

    // Construir consulta de deseos
    const wishesQuery: any = {
      where: { 
        userId: contactId
      },
      attributes: ['id', 'title', 'description', 'image', 'position', 'isReserved', 'reservedBy'],
      order: [['position', 'ASC']]
    };

    // Si no se permite mostrar todos los deseos, solo mostrar el #1
    if (!privacy.showAllWishes) {
      wishesQuery.where.position = 1;
    }

    const wishes = await Wish.findAll(wishesQuery);

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
