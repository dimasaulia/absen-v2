-- CreateEnum
CREATE TYPE "SchedulerType" AS ENUM ('EOFFICE', 'MYPELINDO');

-- AlterTable
ALTER TABLE "Scheduler" ADD COLUMN     "scheduler_type" "SchedulerType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "device_name" TEXT;
