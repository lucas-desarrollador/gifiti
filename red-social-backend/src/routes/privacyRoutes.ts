import { Router } from 'express';
import { 
  getPrivacySettings,
  updatePrivacySettings
} from '../controllers/privacyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener configuraciones de privacidad del usuario
router.get('/', getPrivacySettings);

// Actualizar configuraciones de privacidad del usuario
router.put('/', updatePrivacySettings);

export default router;
