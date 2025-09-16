import { Request, Response } from 'express';
import { Notification, User, Wish } from '../models';
import { Op } from 'sequelize';

// Obtener notificaciones del usuario actual
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Notification.findAndCountAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          as: 'relatedUser',
          attributes: ['id', 'nickname', 'realName', 'profileImage'],
        },
        {
          model: Wish,
          as: 'relatedWish',
          attributes: ['id', 'title', 'image'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        notifications: rows,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: user.id },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada',
      });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      data: notification,
      message: 'Notificación marcada como leída',
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    await Notification.update(
      { isRead: true },
      { where: { userId: user.id, isRead: false } }
    );

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas',
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Eliminar notificación (IGNORAR)
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: user.id },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada',
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notificación eliminada',
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener contador de notificaciones no leídas
export const getUnreadNotificationCount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const count = await Notification.count({
      where: { userId: user.id, isRead: false },
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Error al obtener contador de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Función auxiliar para crear notificación de reserva
export const createWishReservedNotification = async (
  wishOwnerId: string,
  reserverId: string,
  wishId: string,
  reserverName: string,
  wishTitle: string
) => {
  try {
    await Notification.create({
      userId: wishOwnerId,
      type: 'wish_reserved',
      title: '¡Tu deseo ha sido reservado!',
      message: `${reserverName} ha reservado tu deseo "${wishTitle}"`,
      relatedUserId: reserverId,
      relatedWishId: wishId,
      metadata: {
        reserverName,
        wishTitle,
      },
    });
    console.log('✅ Notificación de reserva creada');
  } catch (error) {
    console.error('❌ Error al crear notificación de reserva:', error);
  }
};

// Función auxiliar para crear notificación de cancelación de reserva
export const createWishCancelledNotification = async (
  wishOwnerId: string,
  reserverId: string,
  wishId: string,
  reserverName: string,
  wishTitle: string
) => {
  try {
    await Notification.create({
      userId: wishOwnerId,
      type: 'wish_cancelled',
      title: 'Reserva cancelada',
      message: `${reserverName} ha cancelado la reserva de tu deseo "${wishTitle}"`,
      relatedUserId: reserverId,
      relatedWishId: wishId,
      metadata: {
        reserverName,
        wishTitle,
      },
    });
    console.log('✅ Notificación de cancelación creada');
  } catch (error) {
    console.error('❌ Error al crear notificación de cancelación:', error);
  }
};

// Limpiar notificaciones de ejemplo
export const cleanupExampleNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Eliminar notificaciones de ejemplo
    const deletedCount = await Notification.destroy({
      where: {
        userId: user.id,
        [require('sequelize').Op.or]: [
          { title: 'Nuevo contacto' },
          { title: 'Nuevo deseo' },
          { title: 'Bienvenido a GiFiTi' },
          { type: 'contact_request' },
          { type: 'wish_created' },
          { type: 'welcome' }
        ]
      }
    });

    res.json({
      success: true,
      message: `Eliminadas ${deletedCount} notificaciones de ejemplo`,
      deletedCount
    });
  } catch (error) {
    console.error('Error al limpiar notificaciones de ejemplo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener avisos del usuario actual (excluyendo notificaciones de reservas de deseos)
export const getUserAvisos = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    // Tipos de avisos (excluyendo wish_reserved y wish_cancelled)
    const avisoTypes = [
      'contact_deleted',
      'wish_viewed', 
      'wish_deleted_by_contact',
      'address_changed',
      'account_deleted',
      'wish_added',
      'wish_modified',
      'contact_request',
      'birthday_reminder'
    ];

    const { count, rows } = await Notification.findAndCountAll({
      where: { 
        userId: user.id,
        type: {
          [Op.in]: avisoTypes
        }
      },
      include: [
        {
          model: User,
          as: 'relatedUser',
          attributes: ['id', 'nickname', 'realName', 'profileImage'],
        },
        {
          model: Wish,
          as: 'relatedWish',
          attributes: ['id', 'title', 'image'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    const unreadCount = await Notification.count({
      where: { 
        userId: user.id,
        isRead: false,
        type: {
          [Op.in]: avisoTypes
        }
      },
    });

    res.json({
      success: true,
      data: {
        avisos: rows,
        total: count,
        unreadCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error al obtener avisos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
