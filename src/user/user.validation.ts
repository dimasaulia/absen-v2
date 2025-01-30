import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(50),
    name: z.string().min(3).max(100),
    password: z.string().min(3).max(100),
    email: z.string().min(3).max(100),
    provider: z.string().min(3).max(100),
  });

  static readonly REGISTER_GOOGLE: ZodType = z.object({
    username: z.string().min(3).max(50),
    name: z.string().min(3).max(100),
    email: z.string().min(3).max(100),
    provider: z.string().min(3).max(100),
    provider_id: z.string().min(3).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    emailOrUsername: z.string().min(1),
    password: z.string().min(1),
    provider: z.string().min(1),
  });

  static readonly EOFFICE: ZodType = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });

  static readonly SET_USER_JOB: ZodType = z.object({
    job_id: z.number(),
  });
}
