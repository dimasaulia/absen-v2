-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'MANUAL', 'MANUAL_GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider",
ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
