-- CreateTable
CREATE TABLE "ImagePair" (
    "image_pair_id" SERIAL NOT NULL,
    "hi_res_clockin_path" TEXT,
    "hi_res_clockout_path" TEXT,
    "low_res_clockin_path" TEXT,
    "low_res_clockout_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" TEXT,

    CONSTRAINT "ImagePair_pkey" PRIMARY KEY ("image_pair_id")
);

-- AddForeignKey
ALTER TABLE "ImagePair" ADD CONSTRAINT "ImagePair_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
