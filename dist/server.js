"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const socketHandler_1 = __importDefault(require("./sockets/socketHandler"));
const db_1 = require("./db");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const server = node_http_1.default.createServer(app_1.default);
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
(0, socketHandler_1.default)(io);
async function startServer() {
    await (0, db_1.connectDB)(); // 👈 Connect to DB first
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
startServer();
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
//# sourceMappingURL=server.js.map