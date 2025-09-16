"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactProfileController_1 = require("../controllers/contactProfileController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Obtener perfil de contacto
router.get('/:contactId', contactProfileController_1.getContactProfile);
// Obtener deseos de contacto
router.get('/:contactId/wishes', contactProfileController_1.getContactWishes);
exports.default = router;
//# sourceMappingURL=contactProfileRoutes.js.map