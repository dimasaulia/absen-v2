-- CreateTable
CREATE TABLE "ImageLog" (
    "image_log_id" SERIAL NOT NULL,
    "image_pair_id" INTEGER,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ImageLog_pkey" PRIMARY KEY ("image_log_id")
);

-- AddForeignKey
ALTER TABLE "ImageLog" ADD CONSTRAINT "ImageLog_image_pair_id_fkey" FOREIGN KEY ("image_pair_id") REFERENCES "ImagePair"("image_pair_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLog" ADD CONSTRAINT "ImageLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
