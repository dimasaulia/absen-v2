-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "late_time_friday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_monday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_saturday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_sunday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_thursday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_tuesday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "late_time_wednesday" INTEGER NOT NULL DEFAULT 0;
