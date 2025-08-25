"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/create', authMiddleware_1.verifyToken, roomController_1.createRoom);
router.post('/join', authMiddleware_1.verifyToken, roomController_1.joinRoom);
router.get('/', authMiddleware_1.verifyToken, roomController_1.getUserRooms);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map