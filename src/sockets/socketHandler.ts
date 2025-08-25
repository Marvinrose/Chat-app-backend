import { Server, Socket } from 'socket.io';
import { prisma } from '../prismaClient';

interface JoinRoomPayload {
  roomId: string;
  userId: string;
}

interface SendMessagePayload {
  roomId: string;
  userId: string;
  content: string;
}

const setupSocket = (io: Server): void => {
  const messageTimestamps: Record<string, number[]> = {}; // userId -> array of timestamps

  function isRateLimited(userId: string) {
    const now = Date.now();
    if (!messageTimestamps[userId]) messageTimestamps[userId] = [];

    // remove timestamps older than 10 sec
    messageTimestamps[userId] = messageTimestamps[userId].filter(
      (t) => now - t < 10000
    );

    if (messageTimestamps[userId].length >= 5) return true; // limit: 5 messages/10 sec

    messageTimestamps[userId].push(now);
    return false;
  }

  const onlineUsers: Record<string, string> = {}; // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log('User connected', socket.id);

    socket.on('join_room', (data: JoinRoomPayload) => {
      const { roomId, userId } = data;
      socket.join(roomId);
      onlineUsers[userId] = socket.id;
      io.to(roomId).emit('user_status', { userId, status: 'online' });
    });

    socket.on('send_message', async (data: SendMessagePayload) => {
      const { roomId, userId, content } = data;
      if (!content) return;

      if (isRateLimited(userId)) {
        socket.emit('error', {
          message: 'Rate limit exceeded (max 5 messages per 10s)',
        });
        return;
      }

      const message = await prisma.message.create({
        data: { roomId, userId, content },
      });

      io.to(roomId).emit('receive_message', message);
    });

    socket.on('typing', ({ roomId, userId }: { roomId: string; userId: string }) => {
      socket.to(roomId).emit('typing', { userId });
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected', socket.id);

      // Find userId by socket
      const userId = Object.keys(onlineUsers).find(
        (id) => onlineUsers[id] === socket.id
      );

      if (userId) {
        delete onlineUsers[userId];
        await prisma.user.update({
          where: { id: userId },
          data: { lastSeen: new Date() },
        });
        // optional: broadcast offline status
      }
    });
  });
};

export default setupSocket;
