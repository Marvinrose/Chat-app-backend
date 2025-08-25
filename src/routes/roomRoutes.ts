import { Router } from 'express';
import { createRoom, joinRoom, getUserRooms } from '../controllers/roomController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/create', verifyToken, createRoom);
router.post('/join', verifyToken, joinRoom);
router.get('/', verifyToken, getUserRooms);

export default router;
