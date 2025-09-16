"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCount = exports.searchUsers = exports.getUserById = exports.updateProfile = exports.getProfile = exports.checkUserExists = exports.uploadProfileImage = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configurar multer para subir archivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/profiles';
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path_1.default.extname(file.originalname));
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
exports.uploadProfileImage = upload.single('profileImage');
// Verificar si un usuario existe por email
const checkUserExists = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email requerido'
            });
        }
        const user = await models_1.User.findOne({
            where: { email: email }
        });
        res.json({
            success: true,
            exists: !!user
        });
    }
    catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
exports.checkUserExists = checkUserExists;
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const userResponse = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            realName: user.realName,
            birthDate: user.birthDate,
            profileImage: user.profileImage,
            city: user.city,
            province: user.province,
            country: user.country,
            postalAddress: user.postalAddress,
            age: user.age,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({
            success: true,
            data: userResponse
        });
    }
    catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { nickname, realName, birthDate, city, province, country, postalAddress, age } = req.body;
        // Verificar si el nickname ya está en uso por otro usuario
        if (nickname && nickname !== user.nickname) {
            const existingUser = await models_1.User.findOne({
                where: { nickname }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Este nickname ya está en uso'
                });
            }
        }
        // Actualizar datos del usuario
        const updateData = {};
        if (nickname)
            updateData.nickname = nickname;
        if (realName)
            updateData.realName = realName;
        if (birthDate)
            updateData.birthDate = birthDate;
        if (city !== undefined)
            updateData.city = city;
        if (province !== undefined)
            updateData.province = province;
        if (country !== undefined)
            updateData.country = country;
        if (postalAddress !== undefined)
            updateData.postalAddress = postalAddress;
        if (age !== undefined)
            updateData.age = parseInt(age);
        // Manejar imagen de perfil si se subió
        if (req.file) {
            updateData.profileImage = req.file.filename;
        }
        await user.update(updateData);
        const userResponse = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            realName: user.realName,
            birthDate: user.birthDate,
            profileImage: user.profileImage,
            city: user.city,
            province: user.province,
            country: user.country,
            postalAddress: user.postalAddress,
            age: user.age,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({
            success: true,
            data: userResponse,
            message: 'Perfil actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updateProfile = updateProfile;
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await models_1.User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserById = getUserById;
const searchUsers = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda requerido'
            });
        }
        const { count, rows } = await models_1.User.findAndCountAll({
            where: {
                [sequelize_1.Op.or]: [
                    { nickname: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { realName: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${q}%` } }
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
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.searchUsers = searchUsers;
const getUserCount = async (req, res) => {
    try {
        const userCount = await models_1.User.count();
        res.json({
            success: true,
            data: {
                count: userCount,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error al obtener contador de usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserCount = getUserCount;
//# sourceMappingURL=userController.js.map