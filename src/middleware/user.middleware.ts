import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { UserData, UserResponse } from '../user/user.model';
import { prisma } from '../providers/database.providers';
import { UserServiceMiddleware } from './user.service.middleware';

export const apiAuthMiddleware = async (c: Context, next: Next) => {
  const authorizationCookie = getCookie(c, 'Authorization');
  if (!authorizationCookie) {
    throw new HTTPException(401, {
      message: 'Please Login First',
    });
  }

  const decodedPayload = (await verify(
    authorizationCookie,
    Bun.env.JWT_SECRET!
  )) as UserResponse;

  const userData = UserServiceMiddleware.verifyUser(decodedPayload);

  if (userData === null)
    throw new HTTPException(401, {
      message: 'User Tidak Ditemukan',
    });

  c.set('userData', userData);

  // Proceed to the next middleware or main handler
  await next();
};

export const webAuthMiddleware = async (c: Context, next: Next) => {
  const authorizationCookie = getCookie(c, 'Authorization');
  if (!authorizationCookie) {
    return c.redirect('/auth/login');
  }

  const decodedPayload = (await verify(
    authorizationCookie,
    Bun.env.JWT_SECRET!
  )) as UserResponse;

  const userData = UserServiceMiddleware.verifyUser(decodedPayload);

  if (userData === null) return c.redirect('/auth/login');

  c.set('userData', userData);

  // Proceed to the next middleware or main handler
  await next();
};
