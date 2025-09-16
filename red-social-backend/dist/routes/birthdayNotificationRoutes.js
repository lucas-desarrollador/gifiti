"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const birthdayNotificationController_1 = require("../controllers/birthdayNotificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Obtener notificaciones de cumpleaños
router.get('/', birthdayNotificationController_1.getBirthdayNotifications);
// Marcar notificación específica como leída
router.put('/:notificationId/read', birthdayNotificationController_1.markBirthdayNotificationAsRead);
// Revertir notificación específica (marcar como no leída)
router.put('/:notificationId/unread', birthdayNotificationController_1.markBirthdayNotificationAsUnread);
// Marcar todas las notificaciones como leídas
router.put('/mark-all-read', birthdayNotificationController_1.markAllBirthdayNotificationsAsRead);
exports.default = router;
//# sourceMappingURL=birthdayNotificationRoutes.js.map