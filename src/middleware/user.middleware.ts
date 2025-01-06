import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { UserData, UserResponse } from '../user/user.model';
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

  const user = await prisma.user.findUnique({
    select: {
      user_id: true,
      username: true,
      email: true,
      password: true,
      full_name: true,
      provider: true,
      job_id: true,
      role: {
        select: {
          name: true,
        },
      },
    },
    where: {
      username: decodedPayload.username,
    },
  });

  if (!user)
    throw new HTTPException(401, {
      message: 'User Tidak Ditemukan',
    });

  const userData: UserData = {
    user_id: user.user_id,
    username: user.username,
    name: user.full_name,
    role: user.role.name,
    job_id: user.job_id,
  };

  c.set('userData', userData);

  // Proceed to the next middleware or main handler
  await next();
};
