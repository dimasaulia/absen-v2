import { Job, JobActivity } from '@prisma/client';

export type JobActivityRequest = {
  activity_name: string;
  job_id: number;
};

export type JobActivityResponse = {
  activity_id: number;
  activity_name: string;
  job_name: string;
};

export type JobRequest = {
  job_name: string;
};

export type JobResponse = {
  job_id: number;
  job_name: string;
};

export function toJobResponse(job: Job): JobResponse {
  return {
    job_id: job.job_id,
    job_name: job.name,
  } as JobResponse;
}
