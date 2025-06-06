import { Hono } from 'hono';
import Layout from '../providers/layout/index.layout';
import LoginPage from '../providers/page/login.page';
import {
  webAuthMiddleware,
  webEofficeMiddleware,
  webJobMiddleware,
  webMyPelindoMiddleware,
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
import { navbarPath } from '../providers/path.providers';
import MyPelindoPage from '../providers/page/mypelindo.page';
import ImagePage from '../providers/page/image.page';
import { ImageService } from '../image/image.service';

export const dashboardWeb = new Hono();

dashboardWeb.use(webAuthMiddleware);
dashboardWeb.get('/eoffice', async (c) => {
  return c.html(
    <Layout js={[navbarPath, '/public/js/eoffice.js']}>
      <SidebarLayout>
        <EofficePage />
      </SidebarLayout>
    </Layout>
  );
});

dashboardWeb.get('/mypelindo', async (c) => {
  return c.html(
    <Layout js={[navbarPath, '/public/js/mypelindo.js']}>
      <SidebarLayout>
        <MyPelindoPage />
      </SidebarLayout>
    </Layout>
  );
});

dashboardWeb.get(
  '/job',
  webEofficeMiddleware,
  webMyPelindoMiddleware,
  async (c) => {
    const allJob = await ActivityService.getAllJob(c);
    const jobs: SelectOption[] = allJob.map((j) => {
      return { id: j.job_id, value: j.job_name };
    });
    return c.html(
      <Layout js={[navbarPath, '/public/js/job.js']}>
        <SidebarLayout>
          <JobPage job={jobs} />
        </SidebarLayout>
      </Layout>
    );
  }
);

dashboardWeb.get(
  '/attendance',
  webEofficeMiddleware,
  webMyPelindoMiddleware,
  webJobMiddleware,
  async (c) => {
    const userLocation = await LocationService.getUserLocation(c);
    const location: SelectOption[] = userLocation.map((l) => {
      return { id: l.location_id, value: l.name };
    });
    return c.html(
      <Layout js={[navbarPath, '/public/js/attendance.js']}>
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
  webMyPelindoMiddleware,
  webJobMiddleware,
  async (c) => {
    const userActivity = await ActivityService.getUserJobActivity(c);

    return c.html(
      <Layout js={[navbarPath, '/public/js/activity.js']}>
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
  webMyPelindoMiddleware,
  webJobMiddleware,
  async (c) => {
    const location = await LocationService.getUserLocation(c);
    return c.html(
      <Layout js={[navbarPath, '/public/js/location.js']}>
        <SidebarLayout>
          <LoctionPage location={location} />
        </SidebarLayout>
      </Layout>
    );
  }
);

dashboardWeb.get(
  '/image',
  webEofficeMiddleware,
  webMyPelindoMiddleware,
  webJobMiddleware,
  async (c) => {
    const images = await ImageService.getImage(c);
    return c.html(
      <Layout js={[navbarPath, '/public/js/image.js']}>
        <SidebarLayout>
          <ImagePage images={images} />
        </SidebarLayout>
      </Layout>
    );
  }
);
