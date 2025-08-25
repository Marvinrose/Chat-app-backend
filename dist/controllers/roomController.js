"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRooms = exports.joinRoom = exports.createRoom = void 0;
const prismaClient_1 = require("../prismaClient");
// Create a new room
const createRoom = async (req, res) => {
    const { name, type } = req.body;
    const userId = req.user.id;
    if (!name || !type)
        return res.status(400).json({ message: 'Room name and type required' });
    try {
        const room = await prismaClient_1.prisma.room.create({
            data: {
                name,
                type,
                roomMembers: { create: { userId } },
            },
            include: { roomMembers: true },
        });
        res.status(201).json(room);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};
exports.createRoom = createRoom;
// Join existing room
const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    const userId = req.user.id;
    if (!roomId)
        return res.status(400).json({ message: 'Room ID required' });
    try {
        const existingMembership = await prismaClient_1.prisma.roomMember.findFirst({
            where: { roomId, userId },
        });
        if (existingMembership)
            return res.status(400).json({ message: 'Already in room' });
        const membership = await prismaClient_1.prisma.roomMember.create({
            data: { roomId, userId },
        });
        res.json({ message: 'Joined room', membership });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to join room' });
    }
};
exports.joinRoom = joinRoom;
// List all rooms for a user
const getUserRooms = async (req, res) => {
    const userId = req.user.id;
    try {
        const rooms = await prismaClient_1.prisma.room.findMany({
            where: { roomMembers: { some: { userId } } },
            include: { roomMembers: true },
        });
        res.json(rooms);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};
exports.getUserRooms = getUserRooms;
//# sourceMappingURL=roomController.js.map