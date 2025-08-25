"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socketHandler_1 = __importDefault(require("../sockets/socketHandler"));
const globals_1 = require("@jest/globals");
jest.mock("../prismaClient", () => ({
    prisma: {
        message: {
            create: jest.fn().mockImplementation(({ data }) => Promise.resolve({
                id: "m1",
                ...data,
                createdAt: new Date(),
            })),
        },
        user: {
            update: jest.fn().mockResolvedValue({}),
        },
    },
}));
let io, httpServer;
let clientSocket;
(0, globals_1.beforeAll)((done) => {
    httpServer = (0, http_1.createServer)();
    io = new socket_io_1.Server(httpServer);
    (0, socketHandler_1.default)(io);
    httpServer.listen(() => {
        done();
    });
});
(0, globals_1.afterAll)(() => {
    io.close();
    httpServer.close();
});
// fresh client before each test
(0, globals_1.beforeEach)((done) => {
    const port = httpServer.address().port;
    clientSocket = (0, socket_io_client_1.default)(`http://localhost:${port}`);
    clientSocket.on("connect", done);
});
// close client after each test
(0, globals_1.afterEach)(() => {
    clientSocket.close();
});
(0, globals_1.test)("should deliver message to room", (done) => {
    const roomId = "room1";
    const userId = "user1";
    clientSocket.emit("join_room", { roomId, userId });
    clientSocket.on("receive_message", (msg) => {
        (0, globals_1.expect)(msg.content).toBe("Hello world");
        (0, globals_1.expect)(msg.roomId).toBe(roomId);
        (0, globals_1.expect)(msg.userId).toBe(userId);
        done();
    });
    clientSocket.emit("send_message", {
        roomId,
        userId,
        content: "Hello world",
    });
});
(0, globals_1.test)("should enforce rate limiting", (done) => {
    const roomId = "room2";
    const userId = "user2";
    clientSocket.emit("join_room", { roomId, userId });
    // send 6 messages quickly
    for (let i = 0; i < 6; i++) {
        clientSocket.emit("send_message", {
            roomId,
            userId,
            content: `msg ${i}`,
        });
    }
    clientSocket.on("error", (err) => {
        try {
            (0, globals_1.expect)(err.message).toContain("Rate limit exceeded");
            done();
        }
        catch (e) {
            done(e);
        }
    });
});
//# sourceMappingURL=socket.test.js.map