"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservation = exports.reserveWish = exports.exploreWishes = exports.reorderWishes = exports.deleteWish = exports.updateWish = exports.addWish = exports.getUserWishesById = exports.getUserWishes = exports.uploadWishImage = void 0;
const models_1 = require("../models");
const notificationController_1 = require("./notificationController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Configurar multer para subir imágenes de deseos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/wishes';
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'wish-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
});
exports.uploadWishImage = upload.single('image');
const getUserWishes = async (req, res) => {
    try {
        const user = req.user;
        const wishes = await models_1.Wish.findAll({
            where: { userId: user.id },
            order: [['position', 'ASC']],
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'nickname', 'realName', 'profileImage']
                }
            ]
        });
        res.json({
            success: true,
            data: wishes
        });
    }
    catch (error) {
        console.error('Error al obtener deseos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserWishes = getUserWishes;
const getUserWishesById = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishes = await models_1.Wish.findAll({
            where: { userId },
            order: [['position', 'ASC']],
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'nickname', 'realName', 'profileImage']
                }
            ]
        });
        res.json({
            success: true,
            data: wishes
        });
    }
    catch (error) {
        console.error('Error al obtener deseos del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserWishesById = getUserWishesById;
const addWish = async (req, res) => {
    try {
        const user = req.user;
        const { title, description, purchaseLink } = req.body;
        // Verificar que no tenga más de 10 deseos
        const wishCount = await models_1.Wish.count({ where: { userId: user.id } });
        if (wishCount >= 10) {
            return res.status(400).json({
                success: false,
                message: 'No puedes tener más de 10 deseos'
            });
        }
        // Obtener la siguiente posición
        const nextPosition = wishCount + 1;
        const wishData = {
            userId: user.id,
            title,
            description,
            position: nextPosition,
        };
        if (purchaseLink) {
            wishData.purchaseLink = purchaseLink;
        }
        if (req.file) {
            wishData.image = `/uploads/wishes/${req.file.filename}`;
        }
        const wish = await models_1.Wish.create(wishData);
        res.status(201).json({
            success: true,
            data: wish,
            message: 'Deseo agregado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al agregar deseo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.addWish = addWish;
const updateWish = async (req, res) => {
    try {
        const user = req.user;
        const { wishId } = req.params;
        const { title, description, purchaseLink } = req.body;
        console.log('🔄 Actualizando deseo:', {
            wishId,
            userId: user.id,
            title,
            description,
            purchaseLink,
            hasFile: !!req.file
        });
        const wish = await models_1.Wish.findOne({
            where: { id: wishId, userId: user.id }
        });
        if (!wish) {
            console.log('❌ Deseo no encontrado');
            return res.status(404).json({
                success: false,
                message: 'Deseo no encontrado'
            });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (purchaseLink !== undefined) {
            updateData.purchaseLink = purchaseLink;
            console.log('🔗 Actualizando purchaseLink:', purchaseLink);
        }
        if (req.file) {
            updateData.image = `/uploads/wishes/${req.file.filename}`;
        }
        console.log('📝 Datos a actualizar:', updateData);
        await wish.update(updateData);
        console.log('✅ Deseo actualizado exitosamente');
        res.json({
            success: true,
            data: wish,
            message: 'Deseo actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al actualizar deseo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updateWish = updateWish;
const deleteWish = async (req, res) => {
    try {
        const user = req.user;
        const { wishId } = req.params;
        const wish = await models_1.Wish.findOne({
            where: { id: wishId, userId: user.id }
        });
        if (!wish) {
            return res.status(404).json({
                success: false,
                message: 'Deseo no encontrado'
            });
        }
        await wish.destroy();
        res.json({
            success: true,
            message: 'Deseo eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al eliminar deseo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.deleteWish = deleteWish;
const reorderWishes = async (req, res) => {
    try {
        const user = req.user;
        const { wishIds } = req.body;
        if (!Array.isArray(wishIds) || wishIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de IDs de deseos requerida'
            });
        }
        // Actualizar posiciones
        for (let i = 0; i < wishIds.length; i++) {
            await models_1.Wish.update({ position: i + 1 }, { where: { id: wishIds[i], userId: user.id } });
        }
        // Obtener deseos actualizados
        const wishes = await models_1.Wish.findAll({
            where: { userId: user.id },
            order: [['position', 'ASC']]
        });
        res.json({
            success: true,
            data: wishes,
            message: 'Deseos reordenados exitosamente'
        });
    }
    catch (error) {
        console.error('Error al reordenar deseos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.reorderWishes = reorderWishes;
const exploreWishes = async (req, res) => {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        console.log('🔍 Explorando deseos para usuario:', user.id);
        console.log('📊 Parámetros:', { page, limit, offset });
        // 1. Obtener contactos del usuario (aceptados)
        const userContacts = await models_1.Contact.findAll({
            where: {
                userId: user.id,
                status: 'accepted'
            },
            attributes: ['contactId'],
            paranoid: true // Esto excluye automáticamente los registros eliminados
        });
        const contactIds = userContacts.map(contact => contact.contactId).filter(id => id); // Filtrar IDs undefined
        console.log('👥 Contactos del usuario:', contactIds.length);
        // 2. Calcular límites para cada tipo
        const totalLimit = Number(limit);
        const halfLimit = Math.floor(totalLimit / 2);
        const remainingLimit = totalLimit - halfLimit;
        let contactWishes = [];
        let unknownWishes = [];
        // 3. Obtener deseos de contactos (50% del total)
        if (contactIds.length > 0 && halfLimit > 0) {
            // Obtener todos los deseos de contactos disponibles
            const allContactWishes = await models_1.Wish.findAll({
                where: {
                    userId: contactIds
                },
                include: [
                    {
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'realName', 'profileImage']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: totalLimit, // Obtener más para tener variedad
                offset: offset
            });
            // Mezclar y tomar la cantidad deseada
            const shuffledContactWishes = allContactWishes.sort(() => Math.random() - 0.5);
            contactWishes = shuffledContactWishes.slice(0, halfLimit);
        }
        // 4. Obtener deseos de usuarios desconocidos (50% del total)
        if (remainingLimit > 0) {
            // Obtener todos los deseos de usuarios desconocidos disponibles
            const allUnknownWishes = await models_1.Wish.findAll({
                where: {
                    userId: { [sequelize_1.Op.notIn]: [...contactIds, user.id] } // Excluir contactos y deseos propios
                },
                include: [
                    {
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'nickname', 'realName', 'profileImage']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: totalLimit, // Obtener más para tener variedad
                offset: offset
            });
            // Mezclar y tomar la cantidad deseada
            const shuffledUnknownWishes = allUnknownWishes.sort(() => Math.random() - 0.5);
            unknownWishes = shuffledUnknownWishes.slice(0, remainingLimit);
        }
        // 5. Eliminar duplicados y mezclar resultados
        const allWishes = [...contactWishes, ...unknownWishes];
        // Eliminar duplicados por ID
        const uniqueWishes = allWishes.filter((wish, index, self) => index === self.findIndex(w => w.id === wish.id));
        // Si hay pocos deseos únicos, ajustar la distribución
        let finalWishes = uniqueWishes;
        if (uniqueWishes.length < totalLimit) {
            console.log(`⚠️ Solo hay ${uniqueWishes.length} deseos únicos disponibles, ajustando distribución`);
            // Si no hay suficientes deseos de contactos, llenar con desconocidos
            if (contactWishes.length < halfLimit && unknownWishes.length > 0) {
                const additionalUnknown = unknownWishes
                    .filter(wish => !uniqueWishes.some(uw => uw.id === wish.id))
                    .slice(0, totalLimit - uniqueWishes.length);
                finalWishes = [...uniqueWishes, ...additionalUnknown];
            }
        }
        // Eliminar duplicados nuevamente después de agregar deseos adicionales
        const finalUniqueWishes = finalWishes.filter((wish, index, self) => index === self.findIndex(w => w.id === wish.id));
        // Mezclar y limitar resultados
        const shuffledWishes = finalUniqueWishes.sort(() => Math.random() - 0.5);
        const limitedWishes = shuffledWishes.slice(0, totalLimit);
        // 6. Obtener información de privacidad para cada usuario
        const wishesWithPrivacy = await Promise.all(limitedWishes.map(async (wish) => {
            if (wish.user) {
                // Obtener configuración de privacidad del usuario
                const privacySettings = await database_1.default.query('SELECT "isPublicProfile" FROM "privacy_settings" WHERE "userId" = :userId', {
                    replacements: { userId: wish.user.id },
                    type: sequelize_1.QueryTypes.SELECT
                });
                const isPublic = privacySettings.length > 0 ? privacySettings[0].isPublicProfile : true;
                return {
                    ...wish.toJSON(),
                    user: {
                        ...wish.user.toJSON(),
                        isPublic
                    }
                };
            }
            return wish.toJSON();
        }));
        console.log('📊 Deseos encontrados:', {
            contactos: contactWishes.length,
            desconocidos: unknownWishes.length,
            unicos: uniqueWishes.length,
            finales: wishesWithPrivacy.length
        });
        res.json({
            success: true,
            data: {
                data: wishesWithPrivacy,
                total: wishesWithPrivacy.length,
                page: Number(page),
                limit: Number(limit),
                hasMore: wishesWithPrivacy.length === Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Error al explorar deseos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.exploreWishes = exploreWishes;
// Reservar un deseo
const reserveWish = async (req, res) => {
    try {
        const user = req.user;
        const { wishId } = req.params;
        console.log('🎯 Reservando deseo:', { wishId, userId: user.id });
        const wish = await models_1.Wish.findOne({
            where: { id: wishId }
        });
        if (!wish) {
            return res.status(404).json({
                success: false,
                message: 'Deseo no encontrado'
            });
        }
        // Verificar que no sea el propio deseo del usuario
        if (wish.userId === user.id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes reservar tu propio deseo'
            });
        }
        // Verificar que no esté ya reservado
        if (wish.isReserved) {
            return res.status(400).json({
                success: false,
                message: 'Este deseo ya está reservado'
            });
        }
        // Actualizar el deseo como reservado
        await wish.update({
            isReserved: true,
            reservedBy: user.id
        });
        // Obtener información del usuario que reserva
        const reserver = await models_1.User.findByPk(user.id);
        const reserverName = reserver?.realName || reserver?.nickname || 'Usuario';
        // Crear notificación para el dueño del deseo
        await (0, notificationController_1.createWishReservedNotification)(wish.userId, user.id, wish.id, reserverName, wish.title);
        console.log('✅ Deseo reservado exitosamente');
        res.json({
            success: true,
            data: wish,
            message: 'Deseo reservado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al reservar deseo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.reserveWish = reserveWish;
// Cancelar reserva de un deseo
const cancelReservation = async (req, res) => {
    try {
        const user = req.user;
        const { wishId } = req.params;
        console.log('🚫 Cancelando reserva:', { wishId, userId: user.id });
        const wish = await models_1.Wish.findOne({
            where: { id: wishId }
        });
        if (!wish) {
            return res.status(404).json({
                success: false,
                message: 'Deseo no encontrado'
            });
        }
        // Verificar que el usuario sea quien reservó el deseo
        if (wish.reservedBy !== user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para cancelar esta reserva'
            });
        }
        // Actualizar el deseo como no reservado
        await wish.update({
            isReserved: false,
            reservedBy: undefined
        });
        // Obtener información del usuario que cancela
        const reserver = await models_1.User.findByPk(user.id);
        const reserverName = reserver?.realName || reserver?.nickname || 'Usuario';
        // Crear notificación para el dueño del deseo
        await (0, notificationController_1.createWishCancelledNotification)(wish.userId, user.id, wish.id, reserverName, wish.title);
        console.log('✅ Reserva cancelada exitosamente');
        res.json({
            success: true,
            data: wish,
            message: 'Reserva cancelada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al cancelar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.cancelReservation = cancelReservation;
//# sourceMappingURL=wishController.js.map