"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markBirthdayNotificationAsUnread = exports.markAllBirthdayNotificationsAsRead = exports.markBirthdayNotificationAsRead = exports.getBirthdayNotifications = void 0;
const models_1 = require("../models");
const dateUtils_1 = require("../utils/dateUtils");
const getBirthdayNotifications = async (req, res) => {
    try {
        const user = req.user;
        const { daysAhead = 30 } = req.query; // Por defecto 30 días
        // Obtener contactos del usuario
        const contacts = await models_1.Contact.findAll({
            where: {
                userId: user.id,
                status: 'accepted'
            },
            include: [
                {
                    model: models_1.User,
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
            if (!contact.contact?.birthDate)
                continue;
            const daysUntilBirthday = (0, dateUtils_1.getDaysUntilBirthday)(contact.contact.birthDate);
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
                    read: false, // Se implementará persistencia en el futuro
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
    }
    catch (error) {
        console.error('Error al obtener notificaciones de cumpleaños:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getBirthdayNotifications = getBirthdayNotifications;
const markBirthdayNotificationAsRead = async (req, res) => {
    try {
        const user = req.user;
        const { notificationId } = req.params;
        // Por ahora solo retornamos éxito
        // En el futuro se puede implementar persistencia de notificaciones leídas
        res.json({
            success: true,
            message: 'Notificación marcada como leída'
        });
    }
    catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.markBirthdayNotificationAsRead = markBirthdayNotificationAsRead;
const markAllBirthdayNotificationsAsRead = async (req, res) => {
    try {
        const user = req.user;
        // Por ahora solo retornamos éxito
        // En el futuro se puede implementar persistencia de notificaciones leídas
        res.json({
            success: true,
            message: 'Todas las notificaciones marcadas como leídas'
        });
    }
    catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.markAllBirthdayNotificationsAsRead = markAllBirthdayNotificationsAsRead;
// Revertir notificación de cumpleaños (marcar como no leída)
const markBirthdayNotificationAsUnread = async (req, res) => {
    try {
        const user = req.user;
        const { notificationId } = req.params;
        const notification = await models_1.BirthdayNotification.findOne({
            where: { id: notificationId, userId: user.id },
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notificación de cumpleaños no encontrada',
            });
        }
        await notification.update({ read: false });
        res.json({
            success: true,
            data: notification,
            message: 'Notificación de cumpleaños revertida',
        });
    }
    catch (error) {
        console.error('Error al revertir notificación de cumpleaños:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.markBirthdayNotificationAsUnread = markBirthdayNotificationAsUnread;
//# sourceMappingURL=birthdayNotificationController.js.map