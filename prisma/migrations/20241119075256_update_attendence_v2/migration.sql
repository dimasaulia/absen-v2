/*
  Warnings:

  - You are about to drop the column `day_name` on the `Attendance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "day_name",
ADD COLUMN     "is_friday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_monday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_saturday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_sunday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_thursday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_tuesday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_wednesday" BOOLEAN NOT NULL DEFAULT false;
