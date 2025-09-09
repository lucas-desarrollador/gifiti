import { Router } from 'express';
import { 
  getContacts,
  getContactsByBirthday,
  sendContactRequest,
  acceptContactRequest,
  rejectContactRequest,
  removeContact,
  getPendingRequests,
  searchUsersToAdd
} from '../controllers/contactController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de contactos
router.get('/', getContacts);
router.get('/birthday-order', getContactsByBirthday);
router.get('/pending', getPendingRequests);
router.get('/search', searchUsersToAdd);

// Rutas de gestión de contactos
router.post('/request', sendContactRequest);
router.put('/:contactId/accept', acceptContactRequest);
router.put('/:contactId/reject', rejectContactRequest);
router.delete('/:contactId', removeContact);

export default router;
