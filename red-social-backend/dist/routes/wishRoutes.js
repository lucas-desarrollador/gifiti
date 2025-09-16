"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishController_1 = require("../controllers/wishController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Rutas de deseos del usuario actual
router.get('/', wishController_1.getUserWishes);
router.post('/', wishController_1.uploadWishImage, wishController_1.addWish);
router.put('/reorder', wishController_1.reorderWishes);
// Rutas de deseos específicos
router.get('/:wishId', wishController_1.getUserWishesById);
router.put('/:wishId', wishController_1.uploadWishImage, wishController_1.updateWish);
router.delete('/:wishId', wishController_1.deleteWish);
// Rutas de reserva
router.post('/:wishId/reserve', wishController_1.reserveWish);
router.delete('/:wishId/reserve', wishController_1.cancelReservation);
// Rutas de exploración
router.get('/explore', wishController_1.exploreWishes);
// Rutas de deseos de otros usuarios
router.get('/user/:userId', wishController_1.getUserWishesById);
exports.default = router;
//# sourceMappingURL=wishRoutes.js.map