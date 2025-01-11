import { Hono } from 'hono';
import Layout from '../providers/layout/index.layout';
import LoginPage from '../providers/page/login.page';
import { webAuthMiddleware } from '../middleware/user.middleware';

export const dashboardWeb = new Hono();

dashboardWeb.use(webAuthMiddleware);
dashboardWeb.get('/', async (c) => {
  return c.html(<h1>DASHBOARD</h1>);
});
