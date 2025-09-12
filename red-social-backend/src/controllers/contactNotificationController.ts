import { Request, Response } from 'express';
import { Contact, User } from '../models';

// Enviar invitación de contacto
export const sendContactInvitation = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.body;
    const userId = (req as any).user.id;

    // Validaciones
    if (!contactId) {
      return res.status(400).json({
        success: false,
        message: 'contactId es requerido'
      });
    }

    if (userId === contactId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes agregarte a ti mismo como contacto'
      });
    }

    // Verificar si el usuario objetivo existe
    const targetUser = await User.findByPk(contactId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si ya existe una relación
    const existingContact = await Contact.findOne({
      where: {
        userId: userId,
        contactId: contactId
      }
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una relación con este usuario'
      });
    }

    // Verificar si ya existe una invitación pendiente en la dirección opuesta
    const existingReverseContact = await Contact.findOne({
      where: {
        userId: contactId,
        contactId: userId
      }
    });

    if (existingReverseContact) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una invitación pendiente con este usuario'
      });
    }

    // Crear la invitación
    const contact = await Contact.create({
      userId: userId,
      contactId: contactId,
      status: 'pending'
    });

    // Obtener información del usuario que envía la invitación
    const invitingUser = await User.findByPk(userId, {
      attributes: ['id', 'nickname', 'profileImage']
    });

    res.json({
      success: true,
      data: {
        contact,
        invitingUser,
        message: `Invitación enviada a ${targetUser.nickname}`
      }
    });
  } catch (error) {
    console.error('Error al enviar invitación de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener invitaciones pendientes del usuario
export const getPendingInvitations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const pendingInvitations = await Contact.findAll({
      where: {
        contactId: userId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'profileImage', 'realName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: pendingInvitations
    });
  } catch (error) {
    console.error('Error al obtener invitaciones pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Responder a una invitación (aceptar o rechazar)
export const respondToInvitation = async (req: Request, res: Response) => {
  try {
    const { contactId, response } = req.body; // response: 'accepted' | 'rejected'
    const userId = (req as any).user.id;

    // Validaciones
    if (!contactId || !response) {
      return res.status(400).json({
        success: false,
        message: 'contactId y response son requeridos'
      });
    }

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'response debe ser "accepted" o "rejected"'
      });
    }

    // Buscar la invitación pendiente
    const invitation = await Contact.findOne({
      where: {
        userId: contactId,
        contactId: userId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'profileImage']
        }
      ]
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitación no encontrada o ya fue respondida'
      });
    }

    // Actualizar el estado de la invitación
    await invitation.update({ status: response });

    // Si se acepta, crear la relación recíproca
    if (response === 'accepted') {
      await Contact.create({
        userId: userId,
        contactId: contactId,
        status: 'accepted'
      });
    }

    res.json({
      success: true,
      data: {
        invitation,
        response,
        message: response === 'accepted' 
          ? `Contacto agregado: ${invitation.user?.nickname}`
          : `Invitación rechazada de ${invitation.user?.nickname}`
      }
    });
  } catch (error) {
    console.error('Error al responder invitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener contador de invitaciones pendientes
export const getPendingInvitationsCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const count = await Contact.count({
      where: {
        contactId: userId,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error al obtener contador de invitaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
