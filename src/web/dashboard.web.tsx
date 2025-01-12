import { Hono } from 'hono';
import Layout from '../providers/layout/index.layout';
import LoginPage from '../providers/page/login.page';
import {
  webAuthMiddleware,
  webEofficeMiddleware,
  webJobMiddleware,
} from '../middleware/user.middleware';
import AttendancePage from '../providers/page/attendance.page';
import { LocationService } from '../location/location.services';
import { SelectOption } from '../providers/component/select.input';
import SidebarLayout from '../providers/layout/sidebar.layout';
import EofficePage from '../providers/page/eoffice.page';
import { ActivityService } from '../activity/activity.service';
import JobPage from '../providers/page/job.page';
import ActivityPage from '../providers/page/activity.page';
import LoctionPage from '../providers/page/location.page';

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

dashboardWeb.get('/job', webEofficeMiddleware, async (c) => {
  const allJob = await ActivityService.getAllJob(c);
  const jobs: SelectOption[] = allJob.map((j) => {
    return { id: j.job_id, value: j.job_name };
  });
  return c.html(
    <Layout js={'/public/js/job.js'}>
      <SidebarLayout>
        <JobPage job={jobs} />
      </SidebarLayout>
    </Layout>
  );
});

dashboardWeb.get(
  '/attendance',
  webEofficeMiddleware,
  webJobMiddleware,
  async (c) => {
    const userLocation = await LocationService.getUserLocation(c);
    const location: SelectOption[] = userLocation.map((l) => {
      return { id: l.location_id, value: l.name };
    });
    return c.html(
      <Layout js={'/public/js/attendance.js'}>
        <SidebarLayout>
          <AttendancePage location={location} />
        </SidebarLayout>
      </Layout>
    );
  }
);

dashboardWeb.get(
  '/activity',
  webEofficeMiddleware,
  webJobMiddleware,
  async (c) => {
    const userActivity = await ActivityService.getUserJobActivity(c);

    return c.html(
      <Layout js={'/public/js/activity.js'}>
        <SidebarLayout>
          <ActivityPage activity={userActivity} />
        </SidebarLayout>
      </Layout>
    );
  }
);

dashboardWeb.get(
  '/location',
  webEofficeMiddleware,
  webJobMiddleware,
  async (c) => {
    const location = await LocationService.getUserLocation(c);
    return c.html(
      <Layout js={'/public/js/location.js'}>
        <SidebarLayout>
          <LoctionPage location={location} />
        </SidebarLayout>
      </Layout>
    );
  }
);
