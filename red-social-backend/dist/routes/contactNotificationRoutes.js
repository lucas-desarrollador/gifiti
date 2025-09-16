"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactNotificationController_1 = require("../controllers/contactNotificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Enviar invitación de contacto
router.post('/send', contactNotificationController_1.sendContactInvitation);
// Obtener invitaciones pendientes del usuario
router.get('/pending', contactNotificationController_1.getPendingInvitations);
// Responder a una invitación (aceptar o rechazar)
router.post('/respond', contactNotificationController_1.respondToInvitation);
// Obtener contador de invitaciones pendientes
router.get('/count', contactNotificationController_1.getPendingInvitationsCount);
exports.default = router;
//# sourceMappingURL=contactNotificationRoutes.js.map