"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAvisos = exports.cleanupExampleNotifications = exports.createWishCancelledNotification = exports.createWishReservedNotification = exports.getUnreadNotificationCount = exports.deleteNotification = exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
// Obtener notificaciones del usuario actual
const getUserNotifications = async (req, res) => {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { count, rows } = await models_1.Notification.findAndCountAll({
            where: { userId: user.id },
            include: [
                {
                    model: models_1.User,
                    as: 'relatedUser',
                    attributes: ['id', 'nickname', 'realName', 'profileImage'],
                },
                {
                    model: models_1.Wish,
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
    }
    catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.getUserNotifications = getUserNotifications;
// Marcar notificación como leída
const markNotificationAsRead = async (req, res) => {
    try {
        const user = req.user;
        const { notificationId } = req.params;
        const notification = await models_1.Notification.findOne({
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
    }
    catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
// Eliminar notificación (IGNORAR)
const deleteNotification = async (req, res) => {
    try {
        const user = req.user;
        const { notificationId } = req.params;
        const notification = await models_1.Notification.findOne({
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
    }
    catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.deleteNotification = deleteNotification;
// Obtener contador de notificaciones no leídas
const getUnreadNotificationCount = async (req, res) => {
    try {
        const user = req.user;
        const count = await models_1.Notification.count({
            where: { userId: user.id, isRead: false },
        });
        res.json({
            success: true,
            data: { count },
        });
    }
    catch (error) {
        console.error('Error al obtener contador de notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.getUnreadNotificationCount = getUnreadNotificationCount;
// Función auxiliar para crear notificación de reserva
const createWishReservedNotification = async (wishOwnerId, reserverId, wishId, reserverName, wishTitle) => {
    try {
        await models_1.Notification.create({
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
    }
    catch (error) {
        console.error('❌ Error al crear notificación de reserva:', error);
    }
};
exports.createWishReservedNotification = createWishReservedNotification;
// Función auxiliar para crear notificación de cancelación de reserva
const createWishCancelledNotification = async (wishOwnerId, reserverId, wishId, reserverName, wishTitle) => {
    try {
        await models_1.Notification.create({
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
    }
    catch (error) {
        console.error('❌ Error al crear notificación de cancelación:', error);
    }
};
exports.createWishCancelledNotification = createWishCancelledNotification;
// Limpiar notificaciones de ejemplo
const cleanupExampleNotifications = async (req, res) => {
    try {
        const user = req.user;
        // Eliminar notificaciones de ejemplo
        const deletedCount = await models_1.Notification.destroy({
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
    }
    catch (error) {
        console.error('Error al limpiar notificaciones de ejemplo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.cleanupExampleNotifications = cleanupExampleNotifications;
// Obtener avisos del usuario actual (excluyendo notificaciones de reservas de deseos)
const getUserAvisos = async (req, res) => {
    try {
        const user = req.user;
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
        const { count, rows } = await models_1.Notification.findAndCountAll({
            where: {
                userId: user.id,
                type: {
                    [sequelize_1.Op.in]: avisoTypes
                }
            },
            include: [
                {
                    model: models_1.User,
                    as: 'relatedUser',
                    attributes: ['id', 'nickname', 'realName', 'profileImage'],
                },
                {
                    model: models_1.Wish,
                    as: 'relatedWish',
                    attributes: ['id', 'title', 'image'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset,
        });
        const unreadCount = await models_1.Notification.count({
            where: {
                userId: user.id,
                isRead: false,
                type: {
                    [sequelize_1.Op.in]: avisoTypes
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
    }
    catch (error) {
        console.error('Error al obtener avisos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.getUserAvisos = getUserAvisos;
//# sourceMappingURL=notificationController.js.map