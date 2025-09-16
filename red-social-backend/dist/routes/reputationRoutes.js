"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reputationController_1 = require("../controllers/reputationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Ruta pública para obtener reputación de un usuario
router.get('/user/:userId', reputationController_1.getUserReputation);
// Rutas que requieren autenticación
router.use(auth_1.authenticateToken);
// Agregar voto de reputación
router.post('/vote', reputationController_1.addReputationVote);
// Obtener historial de votos de un usuario
router.get('/user/:userId/history', reputationController_1.getUserVoteHistory);
exports.default = router;
//# sourceMappingURL=reputationRoutes.js.map