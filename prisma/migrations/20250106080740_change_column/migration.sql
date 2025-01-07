/*
  Warnings:

  - You are about to drop the column `late_time_friday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_monday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_saturday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_sunday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_thursday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_tuesday` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `late_time_wednesday` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "late_time_friday",
DROP COLUMN "late_time_monday",
DROP COLUMN "late_time_saturday",
DROP COLUMN "late_time_sunday",
DROP COLUMN "late_time_thursday",
DROP COLUMN "late_time_tuesday",
DROP COLUMN "late_time_wednesday",
ADD COLUMN     "late_max_time_friday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_monday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_saturday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_sunday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_thursday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_tuesday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_max_time_wednesday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_friday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_monday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_saturday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_sunday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_thursday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_tuesday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_min_time_wednesday" INTEGER NOT NULL DEFAULT 0;
