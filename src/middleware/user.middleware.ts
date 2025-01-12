import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { UserData, UserResponse } from '../user/user.model';
import { prisma } from '../providers/database.providers';
import { UserServiceMiddleware } from './user.service.middleware';
import {
  JwtTokenExpired,
  JwtTokenSignatureMismatched,
} from 'hono/utils/jwt/types';

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
  try {
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
  } catch (err) {
    if (
      err instanceof JwtTokenExpired ||
      err instanceof JwtTokenSignatureMismatched
    ) {
      return c.redirect('/auth/login');
    }
    throw new HTTPException(401, {
      message: String(err),
    });
  }
};

export const webEofficeMiddleware = async (c: Context, next: Next) => {
  const userData: UserData = await c.get('userData');
  const isEofficeSync = await UserServiceMiddleware.verifyEoffice(userData);
  if (!isEofficeSync) return c.redirect('/dashboard/eoffice');
  return next();
};

export const webJobMiddleware = async (c: Context, next: Next) => {
  const userData: UserData = await c.get('userData');
  const isEofficeSync = await UserServiceMiddleware.verifyJob(userData);
  if (!isEofficeSync) return c.redirect('/dashboard/job');
  return next();
};
