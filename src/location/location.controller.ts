import { Hono } from 'hono';
import { authMiddleware } from '../middleware/user.middleware';
import { LocationService } from './location.services';

export const locationController = new Hono();
locationController.use(authMiddleware);

locationController.get('/', async (c) => {
  const response = await LocationService.getUserLocation(c);
  return c.json({
    data: response,
  });
});
