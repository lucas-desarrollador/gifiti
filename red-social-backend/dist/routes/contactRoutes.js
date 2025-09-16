"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Rutas de contactos
router.get('/', contactController_1.getContacts);
router.get('/birthday-order', contactController_1.getContactsByBirthday);
router.get('/pending', contactController_1.getPendingRequests);
router.get('/sent-invitations', contactController_1.getSentInvitations);
router.get('/search', contactController_1.searchUsersToAdd);
// Rutas de gestión de contactos
router.post('/request', contactController_1.sendContactRequest);
router.put('/:contactId/accept', contactController_1.acceptContactRequest);
router.put('/:contactId/reject', contactController_1.rejectContactRequest);
router.delete('/:contactId', contactController_1.removeContact);
// Rutas de bloqueo de contactos
router.get('/blocked', contactController_1.getBlockedContacts);
router.delete('/:contactId/block', contactController_1.blockAndRemoveContact);
router.put('/:contactId/unblock', contactController_1.unblockContact);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map