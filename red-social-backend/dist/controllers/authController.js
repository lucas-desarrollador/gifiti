"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.login = exports.register = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const register = async (req, res) => {
    try {
        const { email, password, nickname, realName, birthDate } = req.body;
        // Verificar si el usuario ya existe
        const existingUser = await models_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email },
                    { nickname }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Este email ya está registrado' : 'Este nickname ya está en uso'
            });
        }
        // Crear nuevo usuario
        const user = await models_1.User.create({
            email,
            password,
            nickname,
            realName,
            birthDate,
        });
        // Generar token
        const token = (0, auth_1.generateToken)(user.id);
        // Retornar usuario sin contraseña
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
        res.status(201).json({
            success: true,
            data: {
                user: userResponse,
                token
            },
            message: 'Usuario registrado exitosamente'
        });
    }
    catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Buscar usuario por email
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
        }
        // Verificar contraseña
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
        }
        // Generar token
        const token = (0, auth_1.generateToken)(user.id);
        // Retornar usuario sin contraseña
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
            data: {
                user: userResponse,
                token
            },
            message: 'Login exitoso'
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
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
        console.error('Error al obtener usuario actual:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
const logout = async (req, res) => {
    // En una implementación más avanzada, aquí podrías invalidar el token
    res.json({
        success: true,
        message: 'Logout exitoso'
    });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map