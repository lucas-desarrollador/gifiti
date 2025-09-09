import { Router } from 'express';
import { 
  getUserWishes,
  getUserWishesById,
  addWish,
  updateWish,
  deleteWish,
  reorderWishes,
  exploreWishes,
  uploadWishImage
} from '../controllers/wishController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de deseos del usuario actual
router.get('/', getUserWishes);
router.post('/', uploadWishImage, addWish);
router.put('/reorder', reorderWishes);

// Rutas de deseos específicos
router.get('/:wishId', getUserWishesById);
router.put('/:wishId', uploadWishImage, updateWish);
router.delete('/:wishId', deleteWish);

// Rutas de exploración
router.get('/explore', exploreWishes);

// Rutas de deseos de otros usuarios
router.get('/user/:userId', getUserWishesById);

export default router;
