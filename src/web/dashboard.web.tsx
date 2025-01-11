import { Hono } from 'hono';
import Layout from '../providers/layout/index.layout';
import LoginPage from '../providers/page/login.page';
import {
  webAuthMiddleware,
  webEofficeMiddleware,
} from '../middleware/user.middleware';
import AttendancePage from '../providers/page/attendance.page';
import { LocationService } from '../location/location.services';
import { SelectLocation } from '../providers/component/select.input';
import SidebarLayout from '../providers/layout/sidebar.layout';
import EofficePage from '../providers/page/eoffice.page';

export const dashboardWeb = new Hono();

dashboardWeb.use(webAuthMiddleware);
dashboardWeb.get('/eoffice', async (c) => {
  return c.html(
    <Layout js={'/public/js/eoffice.js'}>
      <SidebarLayout>
        <EofficePage />
      </SidebarLayout>
    </Layout>
  );
});

dashboardWeb.get('/attendance', webEofficeMiddleware, async (c) => {
  const userLocation = await LocationService.getUserLocation(c);
  const location: SelectLocation[] = userLocation.map((l) => {
    return { id: l.location_id, value: l.name };
  });
  return c.html(
    <Layout js={'/public/js/attendance.js'}>
      <SidebarLayout>
        <AttendancePage location={location} />
      </SidebarLayout>
    </Layout>
  );
});
