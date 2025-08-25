// src/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

export default prisma;
