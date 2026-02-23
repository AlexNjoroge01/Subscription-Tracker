-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SUPERUSER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
