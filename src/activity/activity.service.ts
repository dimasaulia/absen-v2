import { Context } from 'hono';
import { prisma } from '../providers/database.providers';
import { HTTPException } from 'hono/http-exception';
import { UserData } from '../user/user.model';
import {
  JobActivityRequest,
  JobActivityResponse,
  JobRequest,
  JobResponse,
  toJobResponse,
} from './activity.model';
import { JobActivityValidation, JobValidation } from './activity.validation';

export class ActivityService {
  static async getUserJobActivity(c: Context): Promise<JobActivityResponse[]> {
    const userData: UserData = await c.get('userData');
    const jobActivities: JobActivityResponse[] = [];

    const activities = await prisma.jobActivity.findMany({
      select: {
        name: true,
        job_activityid: true,
        job: {
          select: {
            name: true,
          },
        },
      },
      where: {
        OR: [
          { user_id: userData.user_id },
          { user_id: null, job_id: userData.job_id },
        ],
      },
    });

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      jobActivities.push({
        activity_id: activity.job_activityid!,
        activity_name: activity.name!,
        job_name: activity.job?.name || '',
      });
    }

    return jobActivities;
  }

  static async addJobActivity(
    req: JobActivityRequest,
    c: Context
  ): Promise<JobActivityResponse> {
    const userData = (await c.get('userData')) as UserData;

    const request: JobActivityRequest =
      JobActivityValidation.ADD_JOB_ACTIVITY.parse(req);

    const job = await prisma.jobActivity.create({
      select: {
        job_activityid: true,
        name: true,
        job: {
          select: {
            name: true,
          },
        },
      },
      data: {
        name: request.activity_name,
        job: {
          connect: {
            job_id: userData.job_id!,
          },
        },
        user: {
          connect: {
            user_id: userData.user_id,
          },
        },
      },
    });

    const newJob: JobActivityResponse = {
      activity_id: job.job_activityid!,
      activity_name: job.name!,
      job_name: job.job?.name!,
    };
    return newJob;
  }

  static async getAllJob(c: Context): Promise<JobResponse[]> {
    const jobs: JobResponse[] = [];

    const jobData = await prisma.job.findMany();

    for (let j = 0; j < jobData.length; j++) {
      const job = jobData[j];
      jobs.push(toJobResponse(job));
    }

    return jobs;
  }

  static async addJob(req: JobRequest): Promise<string> {
    const request: JobRequest = JobValidation.ADD_JOB.parse(req);

    await prisma.job.create({
      data: {
        name: request.job_name,
      },
    });

    return 'Sukses Menambahkan Job ';
  }
}
