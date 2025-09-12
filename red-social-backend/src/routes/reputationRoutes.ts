import { Router } from 'express';
import { 
  getUserReputation, 
  addReputationVote, 
  getUserVoteHistory 
} from '../controllers/reputationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Ruta pública para obtener reputación de un usuario
router.get('/user/:userId', getUserReputation);

// Rutas que requieren autenticación
router.use(authenticateToken);

// Agregar voto de reputación
router.post('/vote', addReputationVote);

// Obtener historial de votos de un usuario
router.get('/user/:userId/history', getUserVoteHistory);

export default router;


