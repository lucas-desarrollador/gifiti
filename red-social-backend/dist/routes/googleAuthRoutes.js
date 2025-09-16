"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleAuthController_1 = require("../controllers/googleAuthController");
const router = express_1.default.Router();
// Intercambiar código de autorización por token de acceso
router.post('/token', googleAuthController_1.exchangeCodeForToken);
// Obtener información del usuario
router.post('/userinfo', googleAuthController_1.getUserInfo);
// Verificar si un usuario existe
router.get('/check', googleAuthController_1.checkUserExists);
exports.default = router;
//# sourceMappingURL=googleAuthRoutes.js.map