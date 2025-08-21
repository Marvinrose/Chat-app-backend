import http from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import setupSocket from './sockets/socketHandler.js';
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
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map