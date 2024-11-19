/*
  Warnings:

  - You are about to drop the column `location_id` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_location_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "location_id",
ADD COLUMN     "location_friday_id" INTEGER,
ADD COLUMN     "location_monday_id" INTEGER,
ADD COLUMN     "location_saturday_id" INTEGER,
ADD COLUMN     "location_sunday_id" INTEGER,
ADD COLUMN     "location_thursday_id" INTEGER,
ADD COLUMN     "location_tuesday_id" INTEGER,
ADD COLUMN     "location_wednesday_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_sunday_id_fkey" FOREIGN KEY ("location_sunday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_monday_id_fkey" FOREIGN KEY ("location_monday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_tuesday_id_fkey" FOREIGN KEY ("location_tuesday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_wednesday_id_fkey" FOREIGN KEY ("location_wednesday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_thursday_id_fkey" FOREIGN KEY ("location_thursday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_friday_id_fkey" FOREIGN KEY ("location_friday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_location_saturday_id_fkey" FOREIGN KEY ("location_saturday_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;
