"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Rutas públicas
router.get('/check', userController_1.checkUserExists);
router.get('/count', userController_1.getUserCount);
// Todas las demás rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Rutas de perfil
router.get('/profile', userController_1.getProfile);
router.put('/profile', userController_1.uploadProfileImage, userController_1.updateProfile);
// Rutas de usuarios
router.get('/:userId', userController_1.getUserById);
router.get('/search', userController_1.searchUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map