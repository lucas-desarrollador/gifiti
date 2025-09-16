"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockContact = exports.getBlockedContacts = exports.blockAndRemoveContact = exports.searchUsersToAdd = exports.getSentInvitations = exports.getPendingRequests = exports.removeContact = exports.rejectContactRequest = exports.acceptContactRequest = exports.sendContactRequest = exports.getContactsByBirthday = exports.getContacts = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const getContacts = async (req, res) => {
    try {
        const user = req.user;
        const contacts = await models_1.Contact.findAll({
            where: { userId: user.id },
            include: [
                {
                    model: models_1.User,
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
    }
    catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getContacts = getContacts;
const getContactsByBirthday = async (req, res) => {
    try {
        const user = req.user;
        const contacts = await models_1.Contact.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { userId: user.id, status: 'accepted' },
                    { contactId: user.id, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                },
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                }
            ]
        });
        // Transformar contactos para que siempre muestren la información del otro usuario
        const transformedContacts = contacts.map(contact => {
            // Si el usuario actual es userId, mostrar la información del contact
            // Si el usuario actual es contactId, mostrar la información del user
            const otherUser = contact.userId === user.id ? contact.contact : contact.user;
            return {
                ...contact.toJSON(),
                contact: otherUser
            };
        });
        // Ordenar por proximidad de cumpleaños
        const sortedContacts = transformedContacts.sort((a, b) => {
            const today = new Date();
            // Calcular días hasta el próximo cumpleaños
            const getDaysUntilBirthday = (birthDate) => {
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
    }
    catch (error) {
        console.error('Error al obtener contactos por cumpleaños:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getContactsByBirthday = getContactsByBirthday;
const sendContactRequest = async (req, res) => {
    try {
        const user = req.user;
        const { userId } = req.body;
        if (userId === user.id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes agregarte a ti mismo como contacto'
            });
        }
        // Verificar si el usuario existe
        const targetUser = await models_1.User.findByPk(userId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Verificar si ya existe una relación
        const existingContact = await models_1.Contact.findOne({
            where: {
                [sequelize_1.Op.or]: [
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
        const contact = await models_1.Contact.create({
            userId: user.id,
            contactId: userId,
            status: 'pending'
        });
        const contactWithUser = await models_1.Contact.findByPk(contact.id, {
            include: [
                {
                    model: models_1.User,
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
    }
    catch (error) {
        console.error('Error al enviar solicitud de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.sendContactRequest = sendContactRequest;
const acceptContactRequest = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        const contact = await models_1.Contact.findOne({
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
        const updatedContact = await models_1.Contact.findByPk(contact.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                },
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                }
            ]
        });
        // Transformar para que el campo 'contact' siempre contenga la información del usuario que envió la invitación
        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado después de la actualización'
            });
        }
        const transformedContact = {
            ...updatedContact.toJSON(),
            contact: updatedContact.user // El usuario que envió la invitación
        };
        res.json({
            success: true,
            data: transformedContact,
            message: 'Solicitud de contacto aceptada exitosamente'
        });
    }
    catch (error) {
        console.error('Error al aceptar solicitud de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.acceptContactRequest = acceptContactRequest;
const rejectContactRequest = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        const contact = await models_1.Contact.findOne({
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
    }
    catch (error) {
        console.error('Error al rechazar solicitud de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.rejectContactRequest = rejectContactRequest;
const removeContact = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        console.log('🔍 Eliminando contacto:', {
            userId: user.id,
            contactId: contactId
        });
        const contact = await models_1.Contact.findOne({
            where: {
                id: contactId,
                [sequelize_1.Op.or]: [
                    { userId: user.id },
                    { contactId: user.id }
                ]
            }
        });
        if (!contact) {
            console.log('❌ Contacto no encontrado');
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }
        console.log('✅ Contacto encontrado:', {
            id: contact.id,
            userId: contact.userId,
            contactId: contact.contactId
        });
        // Eliminar el contacto principal
        await contact.destroy();
        console.log('✅ Contacto principal eliminado');
        // También eliminar el contacto recíproco si existe
        const reciprocalContact = await models_1.Contact.findOne({
            where: {
                userId: contact.contactId,
                contactId: user.id
            }
        });
        if (reciprocalContact) {
            console.log('✅ Contacto recíproco encontrado, eliminando:', {
                id: reciprocalContact.id,
                userId: reciprocalContact.userId,
                contactId: reciprocalContact.contactId
            });
            await reciprocalContact.destroy();
            console.log('✅ Contacto recíproco eliminado');
        }
        else {
            console.log('⚠️ No se encontró contacto recíproco');
        }
        res.json({
            success: true,
            message: 'Contacto eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al eliminar contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.removeContact = removeContact;
const getPendingRequests = async (req, res) => {
    try {
        const user = req.user;
        const pendingRequests = await models_1.Contact.findAll({
            where: {
                contactId: user.id,
                status: 'pending'
            },
            include: [
                {
                    model: models_1.User,
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
    }
    catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPendingRequests = getPendingRequests;
const getSentInvitations = async (req, res) => {
    try {
        const user = req.user;
        const sentInvitations = await models_1.Contact.findAll({
            where: {
                userId: user.id,
                status: 'pending'
            },
            include: [
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            data: sentInvitations
        });
    }
    catch (error) {
        console.error('Error al obtener invitaciones enviadas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getSentInvitations = getSentInvitations;
const searchUsersToAdd = async (req, res) => {
    try {
        const user = req.user;
        const { q, page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda requerido'
            });
        }
        // Buscar usuarios que no sean contactos
        const existingContacts = await models_1.Contact.findAll({
            where: { userId: user.id },
            attributes: ['contactId']
        });
        const contactIds = existingContacts.map(contact => contact.contactId);
        const { count, rows } = await models_1.User.findAndCountAll({
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.ne]: user.id } },
                    { id: { [sequelize_1.Op.notIn]: contactIds } },
                    {
                        [sequelize_1.Op.or]: [
                            { nickname: { [sequelize_1.Op.iLike]: `%${q}%` } },
                            { realName: { [sequelize_1.Op.iLike]: `%${q}%` } },
                            { email: { [sequelize_1.Op.iLike]: `%${q}%` } }
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
    }
    catch (error) {
        console.error('Error al buscar usuarios para agregar:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.searchUsersToAdd = searchUsersToAdd;
// Bloquear y eliminar contacto
const blockAndRemoveContact = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        // Buscar el contacto
        const contact = await models_1.Contact.findOne({
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
        // Marcar como bloqueado y eliminar
        await contact.update({
            status: 'blocked',
            deletedAt: new Date()
        });
        // También eliminar el contacto recíproco si existe
        const reciprocalContact = await models_1.Contact.findOne({
            where: {
                userId: contact.contactId,
                contactId: user.id
            }
        });
        if (reciprocalContact) {
            await reciprocalContact.update({
                status: 'blocked',
                deletedAt: new Date()
            });
        }
        res.json({
            success: true,
            message: 'Contacto bloqueado y eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al bloquear y eliminar contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.blockAndRemoveContact = blockAndRemoveContact;
// Obtener contactos bloqueados
const getBlockedContacts = async (req, res) => {
    try {
        const user = req.user;
        const blockedContacts = await models_1.Contact.findAll({
            where: {
                userId: user.id,
                status: 'blocked'
            },
            include: [
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            data: blockedContacts
        });
    }
    catch (error) {
        console.error('Error al obtener contactos bloqueados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getBlockedContacts = getBlockedContacts;
// Desbloquear contacto
const unblockContact = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        // Buscar el contacto bloqueado
        const contact = await models_1.Contact.findOne({
            where: {
                id: contactId,
                userId: user.id,
                status: 'blocked'
            }
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contacto bloqueado no encontrado'
            });
        }
        // Eliminar el contacto bloqueado (no restaurar, solo eliminar de la lista de bloqueados)
        await contact.destroy();
        res.json({
            success: true,
            message: 'Contacto desbloqueado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al desbloquear contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.unblockContact = unblockContact;
//# sourceMappingURL=contactController.js.map