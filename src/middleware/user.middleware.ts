import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';

export const authMiddleware = async (c: Context, next: Next) => {
  const authorizationCookie = getCookie(c, 'Authorization');
  if (!authorizationCookie) {
    throw new HTTPException(401, {
      message: 'Please Login First',
    });
  }

  // Proceed to the next middleware or main handler
  await next();
};
