import type { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  const { name, type } = req.body;
  const userId = (req as any).user.id;

  if (!name || !type) return res.status(400).json({ message: 'Room name and type required' });

  try {
    const room = await prisma.room.create({
      data: {
        name,
        type,
        roomMembers: { create: { userId } },
      },
      include: { roomMembers: true },
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Join existing room
export const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  const userId = (req as any).user.id;

  if (!roomId) return res.status(400).json({ message: 'Room ID required' });

  try {
    const existingMembership = await prisma.roomMember.findFirst({
      where: { roomId, userId },
    });
    if (existingMembership) return res.status(400).json({ message: 'Already in room' });

    const membership = await prisma.roomMember.create({
      data: { roomId, userId },
    });

    res.json({ message: 'Joined room', membership });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join room' });
  }
};

// List all rooms for a user
export const getUserRooms = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const rooms = await prisma.room.findMany({
      where: { roomMembers: { some: { userId } } },
      include: { roomMembers: true },
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};
