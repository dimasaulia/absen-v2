import { Hono } from 'hono';
import { userController } from './user/user.controller';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { serve } from 'bun';
import { CookieStore, sessionMiddleware } from 'hono-sessions';
import { generateState, OAuth2Client } from 'oslo/oauth2';

const store = new CookieStore();

const app = new Hono();

app.use(
  '*',
  sessionMiddleware({
    store,
    encryptionKey: Bun.env.SESSION_ENCRYPTION_KEY,
    expireAfterSeconds: 900,
    cookieOptions: {
      path: '/',
      httpOnly: true,
    },
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/', userController);

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      errors: err.message,
    });
  } else if (err instanceof ZodError) {
    c.status(400);
    return c.json({
      errors: err.message,
    });
  } else {
    c.status(500);
    return c.json({
      errors: err.message,
    });
  }
});

serve({ port: 8000, fetch: app.fetch });

const PORT = 8080; // Change this to your desired port
export default {
  port: 8000,
  fetch: app.fetch,
};
