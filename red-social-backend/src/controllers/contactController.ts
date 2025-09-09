import { Request, Response } from 'express';
import { Contact, User } from '../models';
import { Op } from 'sequelize';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const contacts = await Contact.findAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getContactsByBirthday = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const contacts = await Contact.findAll({
      where: { 
        userId: user.id,
        status: 'accepted'
      },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
        }
      ]
    });

    // Ordenar por proximidad de cumpleaños
    const sortedContacts = contacts.sort((a, b) => {
      const today = new Date();
      
      // Calcular días hasta el próximo cumpleaños
      const getDaysUntilBirthday = (birthDate: string) => {
        const birthday = new Date(birthDate);
        birthday.setFullYear(today.getFullYear());
        
        if (birthday < today) {
          birthday.setFullYear(today.getFullYear() + 1);
        }
        
        return Math.ceil((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      };

      const aDays = a.contact?.birthDate ? getDaysUntilBirthday(a.contact.birthDate) : 999;
      const bDays = b.contact?.birthDate ? getDaysUntilBirthday(b.contact.birthDate) : 999;

      return aDays - bDays;
    });

    res.json({
      success: true,
      data: sortedContacts
    });
  } catch (error) {
    console.error('Error al obtener contactos por cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const sendContactRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { userId } = req.body;

    if (userId === user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes agregarte a ti mismo como contacto'
      });
    }

    // Verificar si el usuario existe
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si ya existe una relación
    const existingContact = await Contact.findOne({
      where: {
        [Op.or]: [
          { userId: user.id, contactId: userId },
          { userId: userId, contactId: user.id }
        ]
      }
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una relación de contacto con este usuario'
      });
    }

    // Crear solicitud de contacto
    const contact = await Contact.create({
      userId: user.id,
      contactId: userId,
      status: 'pending'
    });

    const contactWithUser = await Contact.findByPk(contact.id, {
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: contactWithUser,
      message: 'Solicitud de contacto enviada exitosamente'
    });
  } catch (error) {
    console.error('Error al enviar solicitud de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const acceptContactRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { contactId } = req.params;

    const contact = await Contact.findOne({
      where: { 
        id: contactId,
        contactId: user.id,
        status: 'pending'
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de contacto no encontrada'
      });
    }

    await contact.update({ status: 'accepted' });

    const updatedContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedContact,
      message: 'Solicitud de contacto aceptada exitosamente'
    });
  } catch (error) {
    console.error('Error al aceptar solicitud de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const rejectContactRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { contactId } = req.params;

    const contact = await Contact.findOne({
      where: { 
        id: contactId,
        contactId: user.id,
        status: 'pending'
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de contacto no encontrada'
      });
    }

    await contact.update({ status: 'rejected' });

    res.json({
      success: true,
      message: 'Solicitud de contacto rechazada exitosamente'
    });
  } catch (error) {
    console.error('Error al rechazar solicitud de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const removeContact = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { contactId } = req.params;

    const contact = await Contact.findOne({
      where: { 
        id: contactId,
        userId: user.id
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    await contact.destroy();

    res.json({
      success: true,
      message: 'Contacto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const pendingRequests = await Contact.findAll({
      where: { 
        contactId: user.id,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: pendingRequests
    });
  } catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const searchUsersToAdd = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }

    // Buscar usuarios que no sean contactos
    const existingContacts = await Contact.findAll({
      where: { userId: user.id },
      attributes: ['contactId']
    });

    const contactIds = existingContacts.map(contact => contact.contactId);

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: user.id } },
          { id: { [Op.notIn]: contactIds } },
          {
            [Op.or]: [
              { nickname: { [Op.iLike]: `%${q}%` } },
              { realName: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } }
            ]
          }
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
    console.error('Error al buscar usuarios para agregar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
