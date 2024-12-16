-- AlterTable
ALTER TABLE "User" ADD COLUMN     "job_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE SET NULL ON UPDATE CASCADE;
