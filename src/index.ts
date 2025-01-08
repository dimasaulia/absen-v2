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
import { logger } from './providers/logging.providers';
import { schedule } from 'node-cron';
import { wakeupAttendance } from './providers/attendance.providers';
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

logger.info('Set Scheduled Absen Masuk Running On 08.00 WIB');
schedule('0 0 8 * * *', () => {
  logger.info(`Cron Job For Absen Masuk at ${new Date()}`);
  wakeupAttendance('absen_pulang');
});

logger.info('Set Scheduled Absen Pulang Running On 20.00 WIB');
schedule('0 0 20 * * *', () => {
  logger.info(`Cron Job For Absen Pulang at ${new Date()}`);
  wakeupAttendance('absen_pulang');
});

serve({ port: Number(Bun.env.PORT), fetch: app.fetch });

export default {
  port: Number(Bun.env.PORT),
  fetch: app.fetch,
};
