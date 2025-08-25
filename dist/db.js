"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
// src/db.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit if DB connection fails
    }
}
exports.default = prisma;
//# sourceMappingURL=db.js.map