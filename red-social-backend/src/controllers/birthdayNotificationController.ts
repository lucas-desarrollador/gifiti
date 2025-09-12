import { Request, Response } from 'express';
import { Contact, User } from '../models';
import { Op } from 'sequelize';
import { getDaysUntilBirthday } from '../utils/dateUtils';

export const getBirthdayNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { daysAhead = 30 } = req.query; // Por defecto 30 días

    // Obtener contactos del usuario
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

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + Number(daysAhead));

    const birthdayNotifications = [];

    for (const contact of contacts) {
      if (!contact.contact?.birthDate) continue;

      const daysUntilBirthday = getDaysUntilBirthday(contact.contact.birthDate);

      // Solo incluir si está dentro del rango de días especificado
      if (daysUntilBirthday <= Number(daysAhead)) {
        birthdayNotifications.push({
          id: `birthday_${contact.contact.id}`,
          contactId: contact.contact.id,
          contactName: contact.contact.realName,
          contactNickname: contact.contact.nickname,
          contactImage: contact.contact.profileImage,
          birthdayDate: contact.contact.birthDate,
          daysUntil: daysUntilBirthday,
          read: false, // Por ahora siempre false, en el futuro se puede implementar persistencia
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Ordenar por días hasta cumpleaños (más próximos primero)
    birthdayNotifications.sort((a, b) => a.daysUntil - b.daysUntil);

    res.json({
      success: true,
      data: birthdayNotifications
    });
  } catch (error) {
    console.error('Error al obtener notificaciones de cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const markBirthdayNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { notificationId } = req.params;

    // Por ahora solo retornamos éxito
    // En el futuro se puede implementar persistencia de notificaciones leídas
    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const markAllBirthdayNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Por ahora solo retornamos éxito
    // En el futuro se puede implementar persistencia de notificaciones leídas
    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
