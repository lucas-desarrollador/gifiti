import { Router } from 'express';
import { 
  sendContactInvitation,
  getPendingInvitations,
  respondToInvitation,
  getPendingInvitationsCount
} from '../controllers/contactNotificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Enviar invitación de contacto
router.post('/send', sendContactInvitation);

// Obtener invitaciones pendientes del usuario
router.get('/pending', getPendingInvitations);

// Responder a una invitación (aceptar o rechazar)
router.post('/respond', respondToInvitation);

// Obtener contador de invitaciones pendientes
router.get('/count', getPendingInvitationsCount);

export default router;
