import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  getUserById, 
  searchUsers,
  uploadProfileImage,
  checkUserExists,
  getUserCount,
  deleteAccount
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/check', checkUserExists);
router.get('/count', getUserCount);

// Todas las demás rutas requieren autenticación
router.use(authenticateToken);

// Rutas de perfil
router.get('/profile', getProfile);
router.put('/profile', uploadProfileImage, updateProfile);
router.delete('/account', deleteAccount);

// Rutas de usuarios
router.get('/:userId', getUserById);
router.get('/search', searchUsers);

export default router;
