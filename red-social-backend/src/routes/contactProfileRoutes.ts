import { Router } from 'express';
import { 
  getContactProfile,
  getContactWishes
} from '../controllers/contactProfileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener perfil de contacto
router.get('/:contactId', getContactProfile);

// Obtener deseos de contacto
router.get('/:contactId/wishes', getContactWishes);

export default router;
