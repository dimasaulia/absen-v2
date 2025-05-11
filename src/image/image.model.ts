import { ImagePair } from '@prisma/client';

export type ImageStorage = {
  originalClockInFileName?: string;
  originalClockOutFileName?: string;
  hiresClockInFileName?: string;
  hiresClockOutFileName?: string;
  lowresClockInFileName?: string;
  lowresClockOutFileName?: string;
};

export type ImagePairResponse = {
  image_pair_id: number;
  clock_in_image_path: string;
  clock_out_image_path: string;
};

export function toImageResponse(image: ImagePair): ImagePairResponse {
  return {
    image_pair_id: image.image_pair_id,
    clock_in_image_path: image.low_res_clockin_path!,
    clock_out_image_path: image.low_res_clockout_path!,
  };
}
