import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { userController } from './user/user.controller';
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
// import { serve } from 'bun';
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
import { dashboardWeb } from './web/dashboard.web';
import { authWeb } from './web/auth.web';
import { monitoringController } from './monitoring/monitoring.controller';
import { imageController } from './image/image.controller';
import { wakeupMyPelindoAttendance } from './providers/mypelindo.providers';
const store = new CookieStore();

type Variables = {
  userData: UserData;
};

const app = new Hono<{ Variables: Variables }>();

app.use('*', jsxRenderer());
app.use(async (c, next) => {
  logger.info(`Request Url: ${c.req.url}`);
  return next();
});
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

app.get(
  '/public/*',
  serveStatic({
    root: './src/',
    onFound(path, c) {
      // c.header('Cache-Control', `public, immutable, max-age=31536000`);
    },
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`);
    },
  })
);

app.get('/', async (c) => {
  return c.redirect('/dashboard/attendance');
});
app.route('/dashboard', dashboardWeb);
app.route('/auth', authWeb);

app.route('/api/users/', userController);
app.route('/api/locations/', locationController);
app.route('/api/job/', activityController);
app.route('/api/attendance/', attendanceController);
app.route('/api/image/', imageController);
app.route('/api/health/', monitoringController);

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

logger.info(`Server Start On ${new Date()} ${new Date().getTimezoneOffset()}`);
logger.info(
  `Server Start On ${new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
  })} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`
);

logger.info('Set Scheduled Eoffice Absen Masuk Running On 08.00 WIB');
schedule('0 0 8 * * *', () => {
  logger.info(`Cron Job For Absen Masuk Eoffice at ${new Date()}`);
  wakeupAttendance('absen_masuk');
});

logger.info('Set Scheduled Eoffice Absen Pulang Eoffice Running On 20.00 WIB');
schedule('0 0 20 * * *', () => {
  logger.info(`Cron Job For Absen Pulang at ${new Date()}`);
  wakeupAttendance('absen_pulang');
});

logger.info('Set Scheduled MyPelindo Absen Masuk Running On 07.00 WIB');
schedule('0 0 7 * * *', () => {
  logger.info(`Cron Job For Absen Masuk MyPelindo at ${new Date()}`);
  wakeupMyPelindoAttendance('absen_masuk');
});

logger.info('Set Scheduled MyPelindo Absen Pulang Running On 17.00 WIB');
schedule('0 0 17 * * *', () => {
  logger.info(`Cron Job For Absen Pulang MyPelindo at ${new Date()}`);
  wakeupMyPelindoAttendance('absen_pulang');
});

// serve({ port: Number(Bun.env.PORT), fetch: app.fetch });

export default {
  port: Number(Bun.env.PORT),
  fetch: app.fetch,
};
