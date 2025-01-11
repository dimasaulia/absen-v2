import { Hono } from 'hono';
import Layout from '../providers/layout/index.layout';
import LoginPage from '../providers/page/login.page';
import { UserService } from '../user/user.service';

export const authWeb = new Hono();

authWeb.get('/login', async (c) => {
  return c.html(
    <Layout js={['/public/js/login.js']}>
      <LoginPage />
    </Layout>
  );
});

authWeb.get('logout', async (c) => {
  UserService.logout(c);
  return c.redirect('/auth/login');
});
