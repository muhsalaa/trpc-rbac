-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BANNED', 'WARNING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
