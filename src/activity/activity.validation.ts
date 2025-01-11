import { z, ZodType } from 'zod';

export class JobActivityValidation {
  static readonly ADD_JOB_ACTIVITY: ZodType = z.object({
    activity_name: z.string().min(3).max(100),
  });
}

export class JobValidation {
  static readonly ADD_JOB: ZodType = z.object({
    job_name: z.string().min(3).max(100),
  });
}
