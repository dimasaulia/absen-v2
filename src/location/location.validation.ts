import { z, ZodType } from 'zod';

export class LocationValidation {
  static readonly ADD_LOCATION: ZodType = z.object({
    name: z.string().min(3).max(100),
    lokasi: z.string().min(3).max(100),
    alamat: z.string().min(3).max(300),
    state: z.string().min(3).max(100),
    provinsi: z.string().min(3).max(100),
  });
}
