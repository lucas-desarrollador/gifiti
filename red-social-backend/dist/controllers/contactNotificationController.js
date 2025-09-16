"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingInvitationsCount = exports.respondToInvitation = exports.getPendingInvitations = exports.sendContactInvitation = void 0;
const models_1 = require("../models");
// Enviar invitación de contacto
const sendContactInvitation = async (req, res) => {
    try {
        const { contactId } = req.body;
        const userId = req.user.id;
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
        const targetUser = await models_1.User.findByPk(contactId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Verificar si ya existe una relación
        const existingContact = await models_1.Contact.findOne({
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
        const existingReverseContact = await models_1.Contact.findOne({
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
        const contact = await models_1.Contact.create({
            userId: userId,
            contactId: contactId,
            status: 'pending'
        });
        // Obtener información del usuario que envía la invitación
        const invitingUser = await models_1.User.findByPk(userId, {
            attributes: ['id', 'nickname', 'profileImage']
        });
        // Crear notificación para el usuario que recibe la invitación
        try {
            await models_1.Notification.create({
                userId: contactId,
                type: 'contact_request',
                title: 'Nueva invitación de contacto',
                message: `${invitingUser?.nickname || 'Alguien'} quiere agregarte como contacto`,
                relatedUserId: userId,
                metadata: {
                    invitingUserName: invitingUser?.nickname,
                    invitingUserImage: invitingUser?.profileImage,
                },
            });
            console.log('✅ Notificación de invitación creada');
        }
        catch (notificationError) {
            console.error('❌ Error al crear notificación de invitación:', notificationError);
            // No fallar la operación principal si la notificación falla
        }
        res.json({
            success: true,
            data: {
                contact,
                invitingUser,
                message: `Invitación enviada a ${targetUser.nickname}`
            }
        });
    }
    catch (error) {
        console.error('Error al enviar invitación de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.sendContactInvitation = sendContactInvitation;
// Obtener invitaciones pendientes del usuario
const getPendingInvitations = async (req, res) => {
    try {
        const userId = req.user.id;
        const pendingInvitations = await models_1.Contact.findAll({
            where: {
                contactId: userId,
                status: 'pending'
            },
            include: [
                {
                    model: models_1.User,
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
    }
    catch (error) {
        console.error('Error al obtener invitaciones pendientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPendingInvitations = getPendingInvitations;
// Responder a una invitación (aceptar o rechazar)
const respondToInvitation = async (req, res) => {
    try {
        const { contactId, response } = req.body; // response: 'accepted' | 'rejected'
        const userId = req.user.id;
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
        const invitation = await models_1.Contact.findOne({
            where: {
                userId: contactId,
                contactId: userId,
                status: 'pending'
            },
            include: [
                {
                    model: models_1.User,
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
            await models_1.Contact.create({
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
    }
    catch (error) {
        console.error('Error al responder invitación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.respondToInvitation = respondToInvitation;
// Obtener contador de invitaciones pendientes
const getPendingInvitationsCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await models_1.Contact.count({
            where: {
                contactId: userId,
                status: 'pending'
            }
        });
        res.json({
            success: true,
            data: { count }
        });
    }
    catch (error) {
        console.error('Error al obtener contador de invitaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPendingInvitationsCount = getPendingInvitationsCount;
//# sourceMappingURL=contactNotificationController.js.map