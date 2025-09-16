"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrivacySettings = exports.getPrivacySettings = void 0;
const models_1 = require("../models");
const getPrivacySettings = async (req, res) => {
    try {
        const user = req.user;
        // Buscar configuraciones existentes o crear las por defecto
        let privacySettings = await models_1.PrivacySettings.findOne({
            where: { userId: user.id }
        });
        if (!privacySettings) {
            // Crear configuraciones por defecto si no existen
            privacySettings = await models_1.PrivacySettings.create({
                userId: user.id,
                showAge: true,
                showEmail: false,
                showAllWishes: false,
                showContactsList: false,
                showMutualFriends: true,
                showLocation: true,
                showPostalAddress: false,
                isPublicProfile: true,
            });
        }
        res.json({
            success: true,
            data: privacySettings
        });
    }
    catch (error) {
        console.error('Error al obtener configuraciones de privacidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPrivacySettings = getPrivacySettings;
const updatePrivacySettings = async (req, res) => {
    try {
        const user = req.user;
        const { showAge, showEmail, showAllWishes, showContactsList, showMutualFriends, showLocation, showPostalAddress, isPublicProfile } = req.body;
        // Buscar configuraciones existentes o crear nuevas
        let privacySettings = await models_1.PrivacySettings.findOne({
            where: { userId: user.id }
        });
        if (privacySettings) {
            // Actualizar configuraciones existentes
            await privacySettings.update({
                showAge,
                showEmail,
                showAllWishes,
                showContactsList,
                showMutualFriends,
                showLocation,
                showPostalAddress,
                isPublicProfile
            });
        }
        else {
            // Crear nuevas configuraciones
            privacySettings = await models_1.PrivacySettings.create({
                userId: user.id,
                showAge,
                showEmail,
                showAllWishes,
                showContactsList,
                showMutualFriends,
                showLocation,
                showPostalAddress,
                isPublicProfile
            });
        }
        res.json({
            success: true,
            data: privacySettings,
            message: 'Configuraciones de privacidad actualizadas correctamente'
        });
    }
    catch (error) {
        console.error('Error al actualizar configuraciones de privacidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updatePrivacySettings = updatePrivacySettings;
//# sourceMappingURL=privacyController.js.map