import { Router } from 'express';
import { 
  getBirthdayNotifications,
  markBirthdayNotificationAsRead,
  markAllBirthdayNotificationsAsRead
} from '../controllers/birthdayNotificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener notificaciones de cumpleaños
router.get('/', getBirthdayNotifications);

// Marcar notificación específica como leída
router.put('/:notificationId/read', markBirthdayNotificationAsRead);

// Marcar todas las notificaciones como leídas
router.put('/mark-all-read', markAllBirthdayNotificationsAsRead);

export default router;
