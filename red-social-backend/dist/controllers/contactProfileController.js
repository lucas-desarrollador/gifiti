"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactWishes = exports.getContactProfile = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const dateUtils_1 = require("../utils/dateUtils");
const getContactProfile = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        // Verificar que el contacto existe y está aceptado (búsqueda bidireccional)
        const contact = await models_1.Contact.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { userId: user.id, contactId: contactId, status: 'accepted' },
                    { userId: contactId, contactId: user.id, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id', 'nickname', 'realName', 'profileImage', 'birthDate', 'email', 'city', 'province', 'country', 'postalAddress'],
                    include: [
                        {
                            model: models_1.PrivacySettings,
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
        // Determinar cuál es el usuario del contacto (el que no es el usuario actual)
        const contactUser = contact.userId === user.id ? contact.contact : contact.user;
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
            age = (0, dateUtils_1.calculateAge)(contactUser.birthDate);
        }
        // Obtener deseos del contacto
        const wishesQuery = {
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
        const wishes = await models_1.Wish.findAll(wishesQuery);
        // Obtener estadísticas de votos (por ahora mock, en el futuro se implementará)
        const positiveVotes = 0;
        const negativeVotes = 0;
        // Construir perfil respetando configuraciones de privacidad
        const contactProfile = {
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
    }
    catch (error) {
        console.error('Error al obtener perfil de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getContactProfile = getContactProfile;
const getContactWishes = async (req, res) => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        // Verificar que el contacto existe y está aceptado (búsqueda bidireccional)
        const contact = await models_1.Contact.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { userId: user.id, contactId: contactId, status: 'accepted' },
                    { userId: contactId, contactId: user.id, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: models_1.User,
                    as: 'contact',
                    attributes: ['id'],
                    include: [
                        {
                            model: models_1.PrivacySettings,
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
        const wishesQuery = {
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
        const wishes = await models_1.Wish.findAll(wishesQuery);
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
    }
    catch (error) {
        console.error('Error al obtener deseos del contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getContactWishes = getContactWishes;
//# sourceMappingURL=contactProfileController.js.map