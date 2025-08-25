import http from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app';
import setupSocket from './sockets/socketHandler';
import { connectDB } from  './db';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

setupSocket(io);

app.get("/", (req, res) => {
  res.send("✅ Chat App Backend is running!");
});


async function startServer() {
  await connectDB(); // 👈 Connect to DB first

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();


