import express from 'express';
import { 
  exchangeCodeForToken, 
  getUserInfo, 
  checkUserExists 
} from '../controllers/googleAuthController';

const router = express.Router();

// Intercambiar código de autorización por token de acceso
router.post('/token', exchangeCodeForToken);

// Obtener información del usuario
router.post('/userinfo', getUserInfo);

// Verificar si un usuario existe
router.get('/check', checkUserExists);

export default router;
