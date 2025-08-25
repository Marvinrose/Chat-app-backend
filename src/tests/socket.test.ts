import { Server } from "socket.io";
import { createServer } from "http";
import Client, { Socket as ClientSocket } from "socket.io-client";
import setupSocket from "../sockets/socketHandler";
import { prisma } from "../prismaClient";
import { beforeAll, afterAll, beforeEach, afterEach, test, expect } from "@jest/globals";

jest.mock("../prismaClient", () => ({
  prisma: {
    message: {
      create: jest.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: "m1",
          ...data,
          createdAt: new Date(),
        })
      ),
    },
    user: {
      update: jest.fn().mockResolvedValue({}),
    },
  },
}));

let io: Server, httpServer: any;
let clientSocket: ClientSocket;

beforeAll((done) => {
  httpServer = createServer();
  io = new Server(httpServer);
  setupSocket(io);

  httpServer.listen(() => {
    done();
  });
});

afterAll(() => {
  io.close();
  httpServer.close();
});

// fresh client before each test
beforeEach((done) => {
  const port = (httpServer.address() as any).port;
  clientSocket = Client(`http://localhost:${port}`);
  clientSocket.on("connect", done);
});

// close client after each test
afterEach(() => {
  clientSocket.close();
});

test("should deliver message to room", (done) => {
  const roomId = "room1";
  const userId = "user1";

  clientSocket.emit("join_room", { roomId, userId });

  clientSocket.on("receive_message", (msg) => {
    expect(msg.content).toBe("Hello world");
    expect(msg.roomId).toBe(roomId);
    expect(msg.userId).toBe(userId);
    done();
  });

  clientSocket.emit("send_message", {
    roomId,
    userId,
    content: "Hello world",
  });
});

test("should enforce rate limiting", (done) => {
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
      expect(err.message).toContain("Rate limit exceeded");
      done();
    } catch (e) {
      done(e as Error);
    }
  });
});
