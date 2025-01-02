import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { UserResponse } from '../user/user.model';
import { prisma } from '../providers/database.providers';

export const authMiddleware = async (c: Context, next: Next) => {
  const dateNow = new Date();

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

  const user = await prisma.user.count({
    where: { username: decodedPayload.username },
  });

  if (user < 1)
    throw new HTTPException(401, {
      message: 'User Tidak Ditemukan',
    });

  c.set('userData', decodedPayload);

  // Proceed to the next middleware or main handler
  await next();
};
