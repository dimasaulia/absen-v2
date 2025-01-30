import { IUserWithAttendanceAndLocations } from '../attendance/attendance.model';
import { prisma } from './database.providers';
import { logger } from './logging.providers';
import { getRandomMinutes } from './time.providers';
import { Prisma as IPrisma } from '../../node_modules/.prisma/client/index';
import Scheduler from './scheduler.providers';
import { decryptText } from './encription.providers';

export interface ISchedulePayload {
  via: string;
  state: string;
  alamat: string;
  lokasi: string;
  kondisi: string;
  provinsi: string;
  aktivitas: string;
}

export async function userDoLogin(
  username: string,
  password: string
): Promise<[boolean, any]> {
  logger.info(`Executing Login to Eoffice for ${username}`);

  let isSuccessLogin = false;
  const reqBody = new URLSearchParams();
  reqBody.append('username', username);
  reqBody.append('password', password);

  const resp = await fetch('https://eoffice.ilcs.co.id/p2b/login/do_login', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    body: reqBody,
    credentials: 'include',
  });

  isSuccessLogin =
    String(resp.headers.get('refresh')).split(';')[1] ===
    'url=https://eoffice.ilcs.co.id/p2b/absensi/online'
      ? true
      : false;
  return [isSuccessLogin, isSuccessLogin ? resp.headers.get('set-cookie') : ''];
}

export async function userDoAttandend({
  attandendType,
  attandendData,
  cookies,
  taskId,
}: {
  attandendType: string;
  attandendData: ISchedulePayload;
  cookies: string;
  taskId?: string;
}) {
  logger.info('Executing Attandend Proccess');
  if (!['absen_masuk', 'absen_pulang'].includes(attandendType)) {
    return new Error('Pilihan metode absen tidak tersedia');
  }

  const reqBody = new URLSearchParams();
  if (attandendData != null || attandendData != undefined) {
    for (const key in attandendData) {
      reqBody.append(key, attandendData[key as keyof ISchedulePayload]);
    }
  }
  const myHeaders = new Headers();
  const regex = /(ci_session_p2b=[^;]+|TS01d515c4=[^;]+)/g;
  const setCookies = cookies.match(regex);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Cookie', setCookies?.join(';') || '');

  const resp = await fetch(
    `https://eoffice.ilcs.co.id/p2b/absensi/${attandendType}`,
    {
      headers: myHeaders,
      method: 'POST',
      body: reqBody,
      credentials: 'include',
    }
  );

  logger.info('--------- HTTP REQUEST ---------');
  logger.info(`COOKIE => ${resp.headers.getSetCookie()}`);
  logger.info(`RESPONSE => ${await resp.text()}`);

  if (taskId) {
    await prisma.scheduler.deleteMany({
      where: {
        task_id: taskId,
      },
    });
  }
}

const default_loc = {
  via: 'WFS',
  state: 'Kelapa Gading Timur',
  alamat:
    'Jalan Kirana Avenue, RW 01, Kelapa Gading Timur, Kelapa Gading, Jakarta Utara, Daerah Khusus Jakarta, Jawa, 14240, Indonesia',
  lokasi: '-61742.10820000000240.1068938.22940000006929',
  kondisi: 'Sehat',
  provinsi: 'Daerah Khusus Jakarta',
  keterangan: 'Solving Ticket dan update data',
};

export async function wakeupAttendance(
  attandendType: 'absen_masuk' | 'absen_pulang'
) {
  try {
    const currentDay = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();
    const activity = await prisma.jobActivity.findMany({
      select: { name: true, user_id: true, job: { select: { name: true } } },
    });
    const bulkData: IPrisma.SchedulerCreateManyInput[] = [];

    const userAttandend = await prisma.$queryRaw<
      IUserWithAttendanceAndLocations[]
    >(IPrisma.sql`
    SELECT 
        u.user_id,
        u.username, 
        u.eoffice_username, 
        u.eoffice_password,
        j.name "job_name",
        a.is_friday,
        a.is_monday,
        a.is_sunday,
        a.is_thursday,
        a.is_tuesday,
        a.is_wednesday,
        a.is_saturday,
        a.late_min_time_sunday,
        a.late_min_time_monday,
        a.late_min_time_tuesday,
        a.late_min_time_wednesday,
        a.late_min_time_thursday,
        a.late_min_time_friday,
        a.late_min_time_saturday,
        a.late_max_time_sunday,
        a.late_max_time_monday,
        a.late_max_time_tuesday,
        a.late_max_time_wednesday,
        a.late_max_time_thursday,
        a.late_max_time_friday,
        a.late_max_time_saturday,
        -- Friday Location Details
        l_fri.name AS "friday_name",
        l_fri.lokasi AS "friday_lokasi",
        l_fri.alamat AS "friday_alamat",
        l_fri.state AS "friday_state",
        l_fri.provinsi AS "friday_provinsi",
        -- Monday Location Details
        l_mon.name AS "monday_name",
        l_mon.lokasi AS "monday_lokasi",
        l_mon.alamat AS "monday_alamat",
        l_mon.state AS "monday_state",
        l_mon.provinsi AS "monday_provinsi",
        -- Tuesday Location Details
        l_tue.name AS "tuesday_name",
        l_tue.lokasi AS "tuesday_lokasi",
        l_tue.alamat AS "tuesday_alamat",
        l_tue.state AS "tuesday_state",
        l_tue.provinsi AS "tuesday_provinsi",
        -- Wednesday Location Details
        l_wed.name AS "wednesday_name",
        l_wed.lokasi AS "wednesday_lokasi",
        l_wed.alamat AS "wednesday_alamat",
        l_wed.state AS "wednesday_state",
        l_wed.provinsi AS "wednesday_provinsi",
        -- Thursday Location Details
        l_thu.name AS "thursday_name",
        l_thu.lokasi AS "thursday_lokasi",
        l_thu.alamat AS "thursday_alamat",
        l_thu.state AS "thursday_state",
        l_thu.provinsi AS "thursday_provinsi",
        -- Saturday Location Details
        l_sat.name AS "saturday_name",
        l_sat.lokasi AS "saturday_lokasi",
        l_sat.alamat AS "saturday_alamat",
        l_sat.state AS "saturday_state",
        l_sat.provinsi AS "saturday_provinsi",
        -- Sunday Location Details
        l_sun.name AS "sunday_name",
        l_sun.lokasi AS "sunday_lokasi",
        l_sun.alamat AS "sunday_alamat",
        l_sun.state AS "sunday_state",
        l_sun.provinsi AS "sunday_provinsi"
    FROM "User" u
    LEFT JOIN "Attendance" a ON a.user_id = u.user_id
    LEFT JOIN "Job" j ON j.job_id = u.job_id
    -- Joining Location table for each day
    LEFT JOIN "Location" l_fri ON l_fri.location_id = a.location_friday_id
    LEFT JOIN "Location" l_mon ON l_mon.location_id = a.location_monday_id
    LEFT JOIN "Location" l_tue ON l_tue.location_id = a.location_tuesday_id
    LEFT JOIN "Location" l_wed ON l_wed.location_id = a.location_wednesday_id
    LEFT JOIN "Location" l_thu ON l_thu.location_id = a.location_thursday_id
    LEFT JOIN "Location" l_sat ON l_sat.location_id = a.location_saturday_id
    LEFT JOIN "Location" l_sun ON l_sun.location_id = a.location_sunday_id;
  `);

    for (let i = 0; i < userAttandend.length; i++) {
      const user = userAttandend[i];
      const userActivity = activity.filter(
        (d) =>
          d.job?.name == user.job_name &&
          (d.user_id == null || d.user_id == user.user_id)
      );
      const randomActivity =
        userActivity[Math.floor(Math.random() * userActivity.length)]?.name ||
        'Doing something';

      logger.info(`PROCESSING ${user.username}`);

      const isDoAttandence =
        `is_${currentDay}` as keyof IUserWithAttendanceAndLocations;
      const lateMinTimeKey =
        `late_min_time_${currentDay}` as keyof IUserWithAttendanceAndLocations;
      const lateMaxTimeKey =
        `late_max_time_${currentDay}` as keyof IUserWithAttendanceAndLocations;
      const dayNameKey =
        `${currentDay}_name` as keyof IUserWithAttendanceAndLocations;
      const dayLokasiKey =
        `${currentDay}_lokasi` as keyof IUserWithAttendanceAndLocations;
      const dayAlamatKey =
        `${currentDay}_alamat` as keyof IUserWithAttendanceAndLocations;
      const dayStateKey =
        `${currentDay}_state` as keyof IUserWithAttendanceAndLocations;
      const dayProvinsiKey =
        `${currentDay}_provinsi` as keyof IUserWithAttendanceAndLocations;
      const is_do_attandence = user[isDoAttandence] as boolean;
      const loc_name = user[dayNameKey];
      const loc_lokasi = user[dayLokasiKey] || default_loc.lokasi;
      const loc_alamat = user[dayAlamatKey] || default_loc.alamat;
      const loc_state = user[dayStateKey] || default_loc.state;
      const loc_provinsi = user[dayProvinsiKey] || default_loc.provinsi;
      const late_min_time = Number(user[lateMinTimeKey]);
      const late_max_time = Number(user[lateMaxTimeKey]);
      const randomTime = getRandomMinutes(late_min_time, late_max_time);
      const scheduleTime = new Date(new Date().getTime() + randomTime * 60_000);

      const absenPayload: ISchedulePayload = {
        via: 'WFS',
        state: String(loc_state),
        alamat: String(loc_alamat),
        lokasi: String(loc_lokasi),
        provinsi: String(loc_provinsi),
        kondisi: 'Sehat',
        aktivitas: String(randomActivity),
      };

      if (is_do_attandence == true) {
        logger.info(
          `Lakukan Absen Untuk ${user.username} di hari ${currentDay} pada jam ${scheduleTime}`
        );

        const taskId = crypto.randomUUID();
        Scheduler.setTask(
          scheduleTime,
          async () => {
            userDoLogin(
              user.eoffice_username,
              decryptText(user.eoffice_password)
            ).then((v) => {
              userDoAttandend({
                attandendType: attandendType,
                attandendData: absenPayload,
                cookies: String(v[1]),
                taskId: taskId,
              });
            });
          },
          taskId
        );

        bulkData.push({
          task_id: taskId,
          task_time: scheduleTime,
          user_id: user.user_id,
          task_data: JSON.parse(JSON.stringify(absenPayload)),
        });
      }
    }

    await prisma.scheduler.createMany({ data: bulkData });
  } catch (error) {
    logger.error('Wakeup Attendance Failed; Error detail:');
    logger.error(error);
  }
}
