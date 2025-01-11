import { Hono } from 'hono';
import { apiAuthMiddleware } from '../middleware/user.middleware';
import { ActivityService } from './activity.service';
import { JobActivityRequest, JobRequest } from './activity.model';
import { UserData } from '../user/user.model';

export const activityController = new Hono();
activityController.use(apiAuthMiddleware);

activityController.get('/', async (c) => {
  const response = await ActivityService.getAllJob(c);
  return c.json({
    data: response,
  });
});

activityController.post('/', async (c) => {
  const request = (await c.req.json()) as JobRequest;

  const response = await ActivityService.addJob(request);
  return c.json({
    data: response,
  });
});

activityController.get('/activity', async (c) => {
  const response = await ActivityService.getUserJobActivity(c);
  return c.json({
    data: response,
  });
});

activityController.post('/activity', async (c) => {
  const req = (await c.req.json()) as JobActivityRequest;

  const response = await ActivityService.addJobActivity(req, c);
  c.status(201);
  return c.json({
    message: 'Sukses Menambahkan Data',
    data: response,
  });
});
