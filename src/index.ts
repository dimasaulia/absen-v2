import { Hono } from 'hono';
import { userController } from './user/user.controller';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { serve } from 'bun';
import { CookieStore, sessionMiddleware } from 'hono-sessions';
import { generateState, OAuth2Client } from 'oslo/oauth2';
import {
  JwtTokenExpired,
  JwtTokenSignatureMismatched,
} from 'hono/utils/jwt/types';
import { UserData } from './user/user.model';
import { locationController } from './location/location.controller';
import { activityController } from './activity/activity.controller';
import { attendanceController } from './attendance/attendance.controller';

const store = new CookieStore();

type Variables = {
  userData: UserData;
};

const app = new Hono<{ Variables: Variables }>();

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

app.route('/api/users/', userController);
app.route('/api/locations/', locationController);
app.route('/api/job/', activityController);
app.route('/api/attendance/', attendanceController);

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
  } else if (
    err instanceof JwtTokenExpired ||
    err instanceof JwtTokenSignatureMismatched
  ) {
    c.status(401);
    return c.json({
      errors:
        err instanceof JwtTokenExpired ? 'Token Expired' : 'Token Invalid',
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
