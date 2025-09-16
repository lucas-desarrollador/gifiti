"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Obtener notificaciones del usuario
router.get('/', notificationController_1.getUserNotifications);
// Obtener contador de notificaciones no leídas
router.get('/count', notificationController_1.getUnreadNotificationCount);
// Marcar notificación como leída
router.put('/:notificationId/read', notificationController_1.markNotificationAsRead);
// Marcar todas las notificaciones como leídas
router.put('/read-all', notificationController_1.markAllNotificationsAsRead);
// Eliminar notificación (IGNORAR)
router.delete('/:notificationId', notificationController_1.deleteNotification);
// Limpiar notificaciones de ejemplo
router.delete('/cleanup-examples', notificationController_1.cleanupExampleNotifications);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map