import { Server, Socket } from 'socket.io';
import { prisma } from '../prismaClient.js';

interface JoinRoomPayload {
  roomId: number;
  userId: number;
}

interface SendMessagePayload {
  roomId: number;
  userId: number;
  content: string;
}

const setupSocket = (io: Server): void => {

    const messageTimestamps: Record<number, number[]> = {}; // userId -> array of timestamps

function isRateLimited(userId: number) {
  const now = Date.now();
  if (!messageTimestamps[userId]) messageTimestamps[userId] = [];
  // remove timestamps older than 10 sec
  messageTimestamps[userId] = messageTimestamps[userId].filter(t => now - t < 10000);

  if (messageTimestamps[userId].length >= 5) return true; // limit: 5 messages/10 sec

  messageTimestamps[userId].push(now);
  return false;
}

  const onlineUsers: Record<number, string> = {}; // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log('User connected', socket.id);

    socket.on('join_room', (data: JoinRoomPayload) => {
      const { roomId, userId } = data;
      socket.join(roomId.toString());
      onlineUsers[userId] = socket.id;
      io.to(roomId.toString()).emit('user_status', { userId, status: 'online' });
    });

    socket.on('send_message', async (data: SendMessagePayload) => {
      const { roomId, userId, content } = data;
      if (!content) return;
       if (isRateLimited(userId)) {
    socket.emit('error', { message: 'Rate limit exceeded (max 5 messages per 10s)' });
    return;
  }

      const message = await prisma.message.create({
        data: { roomId, userId, content },
      });

      io.to(roomId.toString()).emit('receive_message', message);
    });

    socket.on('typing', ({ roomId, userId }: { roomId: number; userId: number }) => {
      socket.to(roomId.toString()).emit('typing', { userId });
    });

  socket.on('disconnect', async () => {
    console.log('User disconnected', socket.id);

    // Find userId by socket
    const userId = Object.keys(onlineUsers).find(id => onlineUsers[parseInt(id)] === socket.id);
    if (userId) {
      delete onlineUsers[parseInt(userId)];
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { lastSeen: new Date() },
      });
      // Broadcast offline status to all rooms the user is in
      // optional: implement if needed
    }
  });
  });
};

export default setupSocket;
