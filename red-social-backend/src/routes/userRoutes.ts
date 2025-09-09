import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  getUserById, 
  searchUsers,
  uploadProfileImage 
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de perfil
router.get('/profile', getProfile);
router.put('/profile', uploadProfileImage, updateProfile);

// Rutas de usuarios
router.get('/:userId', getUserById);
router.get('/search', searchUsers);

export default router;
