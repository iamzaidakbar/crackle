import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test the connection
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((e) => {
    console.error("Failed to connect to the database:", e);
  });