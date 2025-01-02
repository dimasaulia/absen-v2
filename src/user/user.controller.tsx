import { Hono } from 'hono';
import {
  GoogleUserResponse,
  LoginUserRequest,
  RegisterUserRequest,
} from './user.model';
import { UserService } from './user.service';
import { authMiddleware } from '../middleware/user.middleware';

export const userController = new Hono();

userController.post('/', async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest;
  request.provider = 'MANUAL';
  const response = await UserService.register(request);

  return c.json({
    data: response,
  });
});

userController.get('/', authMiddleware, async (c) => {
  return c.json({ username: 'Detail User' });
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

userController.get('/google/register/callback', async (c) => {
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
    emailOrUsername: username,
    provider: 'GOOGLE',
  });

  return c.redirect('/');
});

userController.get('/google/login/callback', async (c) => {
  const user = await UserService.getGoogleInfo(true, c);
  console.log('USER => ');
  console.log(user);
  await UserService.login(c, {
    emailOrUsername: user.email,
    provider: 'GOOGLE',
  });

  return c.redirect('/');
});
