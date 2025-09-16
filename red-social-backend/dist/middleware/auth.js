"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // Buscar usuario en la base de datos
        const user = await models_1.User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido'
        });
    }
};
exports.authenticateToken = authenticateToken;
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map