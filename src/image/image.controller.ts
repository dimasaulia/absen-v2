import { Hono } from 'hono';
import { ImageService } from './image.service';
import { apiAuthMiddleware } from '../middleware/user.middleware';

export const imageController = new Hono();
imageController.use(apiAuthMiddleware);

imageController.post('/', async (c) => {
  const [isSuccess, data] = await ImageService.uploadImage(c);

  c.status(isSuccess ? 201 : 400);
  return c.json({
    messages: isSuccess ? 'Berhasil Upload Data' : String(data),
    data: data,
  });
});

imageController.get('/', async (c) => {
  const data = await ImageService.getImage(c);

  c.status(200);
  return c.json({
    messages: 'Berhasil Mendapatkan Data',
    data: data,
  });
});
