"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const privacyController_1 = require("../controllers/privacyController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Obtener configuraciones de privacidad del usuario
router.get('/', privacyController_1.getPrivacySettings);
// Actualizar configuraciones de privacidad del usuario
router.put('/', privacyController_1.updatePrivacySettings);
exports.default = router;
//# sourceMappingURL=privacyRoutes.js.map