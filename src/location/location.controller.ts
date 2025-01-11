import { Hono } from 'hono';
import { apiAuthMiddleware } from '../middleware/user.middleware';
import { LocationService } from './location.services';
import { AddLocationRequest } from './location.model';

export const locationController = new Hono();
locationController.use(apiAuthMiddleware);

locationController.get('/', async (c) => {
  const response = await LocationService.getUserLocation(c);
  return c.json({
    data: response,
  });
});

locationController.post('/', async (c) => {
  const locationData = (await c.req.json()) as AddLocationRequest;
  const response = await LocationService.addLocation(c, locationData);
  return c.json({
    data: response,
  });
});
