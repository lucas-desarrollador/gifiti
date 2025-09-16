import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  cleanupExampleNotifications,
  getUserAvisos,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener notificaciones del usuario
router.get('/', getUserNotifications);

// Obtener avisos del usuario
router.get('/avisos', getUserAvisos);

// Obtener contador de notificaciones no leídas
router.get('/count', getUnreadNotificationCount);

// Marcar notificación como leída
router.put('/:notificationId/read', markNotificationAsRead);


// Eliminar notificación (IGNORAR)
router.delete('/:notificationId', deleteNotification);

// Limpiar notificaciones de ejemplo
router.delete('/cleanup-examples', cleanupExampleNotifications);

export default router;
