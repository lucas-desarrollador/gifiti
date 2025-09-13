import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  cleanupExampleNotifications,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener notificaciones del usuario
router.get('/', getUserNotifications);

// Obtener contador de notificaciones no leídas
router.get('/count', getUnreadNotificationCount);

// Marcar notificación como leída
router.put('/:notificationId/read', markNotificationAsRead);

// Marcar todas las notificaciones como leídas
router.put('/read-all', markAllNotificationsAsRead);

// Eliminar notificación (IGNORAR)
router.delete('/:notificationId', deleteNotification);

// Limpiar notificaciones de ejemplo
router.delete('/cleanup-examples', cleanupExampleNotifications);

export default router;
