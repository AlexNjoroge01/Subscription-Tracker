import { PrismaClient } from '../../app/generated/prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// For Prisma 7, we'll initialize the client when needed in API routes
// This is a placeholder that will be properly configured with adapter or accelerateUrl
export const prisma = globalForPrisma.prisma || (() => {
    // @ts-ignore - Prisma 7 client initialization will be done in API routes
    return new PrismaClient()
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
