import { Hono } from 'hono';
import {
  EofficeRequest,
  GoogleUserResponse,
  LoginUserRequest,
  RegisterUserRequest,
} from './user.model';
import { UserService } from './user.service';
import { apiAuthMiddleware } from '../middleware/user.middleware';

export const userController = new Hono();

userController.post('/', async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest;
  request.provider = 'MANUAL';
  const response = await UserService.register(request);

  return c.json({
    data: response,
  });
});

userController.get('/', apiAuthMiddleware, async (c) => {
  const response = await UserService.getUserDetail(c);
  return c.json({
    data: response,
  });
});

userController.post('/login', async (c) => {
  const request = (await c.req.json()) as LoginUserRequest;
  request.provider = 'MANUAL';
  const response = await UserService.login(c, request);

  return c.json({
    data: response,
  });
});

userController.get('/google', async (c) => {
  const url = await UserService.registerWithGoogle(c);

  return c.redirect(url.toString());
});

userController.get('/google/callback', async (c) => {
  const user = await UserService.getGoogleInfo(false, c);
  const username =
    user.name.toLowerCase().replaceAll(' ', '_') +
    '_' +
    Math.floor(100 + Math.random() * 900).toString();

  await UserService.register({
    username: username,
    email: user.email,
    name: user.name,
    provider: 'GOOGLE',
    provider_id: user.sub,
  });

  await UserService.login(c, {
    emailOrUsername: user.email,
    provider: 'GOOGLE',
  });

  return c.redirect('/dashboard/attendance');
});

userController.put('/eoffice', apiAuthMiddleware, async (c) => {
  const req = (await c.req.json()) as EofficeRequest;
  const [resp, isSuccess] = await UserService.syncEoffice(req, c);

  c.status(isSuccess ? 200 : 400);
  return c.json({
    message: resp,
  });
});

userController.put('/job', apiAuthMiddleware, async (c) => {
  const resp = await UserService.setJob(c);
  return c.json({
    message: 'Sukses Memperbaharui Pekerjaan User',
    data: resp,
  });
});

userController.get('/logout', async (c) => {
  UserService.logout(c);
});
