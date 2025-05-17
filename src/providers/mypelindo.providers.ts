import axios from 'axios';
import { prisma } from './database.providers';
import { Prisma as IPrisma } from '../../node_modules/.prisma/client/index';
import { logger } from './logging.providers';
import FormData from 'form-data';
import fs from 'fs';
import { IUserWithAttendanceAndLocations } from '../attendance/attendance.model';
import { formatScheduleTime, getRandomMinutes } from './time.providers';
import Scheduler from './scheduler.providers';
import { decryptText } from './encription.providers';

interface Role {
  IDAPLIKASI: string;
  IDROLE: string;
  NAMAROLE: string;
}

interface RoleList {
  ROLE: Role[];
}

interface RolePortalSI {
  ID_APLIKASI: string;
  NAMA_APLIKASI: string;
  ROLE_LIST: RoleList;
}

interface MyPelindoUserResponse {
  IDACCOUNT: string;
  ROLE: string;
  NIP: string;
  NICK: string;
  NAME: string;
  AVATAR: string | null;
  POSITIONCODE: string;
  POSITION: string;
  BRANCHCODE: string;
  BRANCH: string;
  DITCODE: string | null;
  DIT: string | null;
  SUBDITCODE: string;
  SUBDIT: string;
  DEPARTMENTCODE: string | null;
  DEPARTMENT: string | null;
  TERMINALCODE: string;
  LASTSEEN: string;
  REGISTERDATE: string;
  STATUS: string;
  EMAIL: string;
  USERIDPSI: string;
  JENPEG: string | null;
  NAMA_JENPEG: string | null;
  PERSONAL_SUB_AREA: string;
  PERSONAL_AREA: string;
  KNOWLEDGE_POINT: string;
  PERFORMANCE_POINT: string;
  RECOGNITION_POINT: string;
  HAKAKSES_DESC: string | null;
  AVATAR_BIG: string | null;
  HP: string;
  IS_ACTIVE: string;
  DHC_PENYAKIT_KORMOBID: string | null;
  DHC_ALAMAT: string | null;
  DHC_KECAMATAN: string | null;
  DHC_KABUPATEN_KOTA: string | null;
  DHC_STATUS: string | null;
  DHC_PENYAKIT_KORMOBID_LAINNYA: string | null;
  DHC_POSITIF: string;
  DHC_POSITIF_LOKASI: string | null;
  IS_REGISTER: string;
  COMPANY_CODE: string;
  PROFILE_MODE: string;
  TANOS_TOKEN: string;
  ROLEPORTALSI: RolePortalSI[];
  ACCESSTOKEN: string;
  AUTHKEY: string;
  PROFIL_INFO: string | null;
  ADDRESS: string | null;
}

interface MyPelindoAttendenceRequest {
  GAMBAR: string;
  LAT: string;
  LNG: string;
  TR_DATE: string;
  LOKASI: string;
  KOMENTAR: string | null;
  PROGRAME_NAME: string;
  TIPE: 1 | 2;
}

interface MyPelindoLoginRespone {
  success: boolean;
  token: string;
  jsessionid: string[];
}

export async function userDoLoginPelindo({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<MyPelindoLoginRespone> {
  try {
    logger.info(
      '[userDoAttandendPelindo] Executing userDoLoginPelindo Proccess'
    );
    const authorizationBase64 = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );
    const reqBody = new URLSearchParams();

    const response = await axios.post(
      'https://my.api.pelindo.co.id/auth',
      reqBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/4.9.2',
          Accept: 'application/json, text/plain, */*',
          Authorization: `Basic ${authorizationBase64}`,
        },
        // Ini penting agar cookie seperti JSESSIONID disimpan otomatis (di Node.js dengan adapter khusus)
        withCredentials: true,
      }
    );

    const httpRespData = (await response.data) as MyPelindoUserResponse;

    console.log({
      status: response.status,
      token: httpRespData.ACCESSTOKEN,
      jsessionid: response.headers['set-cookie'],
    });

    return {
      success: response.status == 200 ? true : false,
      token: response.status == 200 ? httpRespData.ACCESSTOKEN : '',
      jsessionid: response.status == 200 ? response.headers['set-cookie']! : [],
    };
  } catch (error) {
    logger.error(
      `[mypelindo.providers.ts] userDoLoginPelindo give error: ${error}`
    );
    return { success: false, token: '', jsessionid: [] };
  }
}

export async function userDoAttandendPelindo({
  attandendData,
  token,
  cookies,
  taskId,
}: {
  attandendData: MyPelindoAttendenceRequest;
  token: string;
  cookies: string[];
  taskId?: string;
}): Promise<number> {
  try {
    logger.info(
      '[userDoAttandendPelindo] Executing MyPelindo Attandend Proccess'
    );
    const reqBody = new FormData();
    if (attandendData != null || attandendData != undefined) {
      for (const key in attandendData) {
        if (key != 'GAMBAR') {
          reqBody.append(
            key,
            String(attandendData[key as keyof MyPelindoAttendenceRequest])
          );
        }

        if (key == 'GAMBAR') {
          const filePath = String(
            attandendData[key as keyof MyPelindoAttendenceRequest]
          );
          reqBody.append(key, fs.createReadStream(filePath));
        }
      }
    }

    const cookieString =
      cookies?.map((cookie: string) => cookie.split(';')[0]).join('; ') ?? '';

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://my.api.pelindo.co.id/absensifc/doabsen',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'accept-encoding': 'gzip',
        'user-agent': 'okhttp/4.9.2',
        Cookie: cookieString,
        ...reqBody.getHeaders(),
      },
      data: reqBody,
    };

    let resp = await axios.request(config);

    logger.info('[userDoAttandendPelindo] http response => ');
    console.log(await resp.data);

    if (taskId) {
      await prisma.scheduler.deleteMany({
        where: {
          task_id: taskId,
        },
      });
    }

    return resp.status;
  } catch (error) {
    logger.error(
      `[mypelindo.providers.ts] userDoAttandendPelindo give error: ${error}`
    );
    return 0;
  }
}

// Bungkus getLength dalam Promise
function getFormLength(form: FormData): Promise<number> {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) return reject(err);
      resolve(length);
    });
  });
}

export async function wakeupMyPelindoAttendance(
  attandendType: 'absen_masuk' | 'absen_pulang'
) {
  logger.info(
    `[mypelindo.providers.ts] wakeupMyPelindoAttendance schedulers run on ${new Date()}`
  );

  try {
    const currentDay = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();
    logger.info(`[mypelindo.providers.ts] day information "${currentDay}"`);
    const bulkData: IPrisma.SchedulerCreateManyInput[] = [];

    const userAttandend = await prisma.$queryRaw<
      IUserWithAttendanceAndLocations[]
    >(IPrisma.sql`
    SELECT 
        u.user_id,
        u.username, 
        u.mypelindo_username "eoffice_username", 
        u.mypelindo_password "eoffice_password",
        u.device_name,
        j.name "job_name",
        a.is_pelindo_friday "is_friday",
        a.is_pelindo_monday "is_monday",
        a.is_pelindo_sunday "is_sunday",
        a.is_pelindo_thursday "is_thursday",
        a.is_pelindo_tuesday "is_tuesday",
        a.is_pelindo_wednesday "is_wednesday",
        a.is_pelindo_saturday "is_saturday",
        a.late_pelindo_min_time_sunday "late_min_time_sunday",
        a.late_pelindo_min_time_monday "late_min_time_monday",
        a.late_pelindo_min_time_tuesday "late_min_time_tuesday",
        a.late_pelindo_min_time_wednesday "late_min_time_wednesday",
        a.late_pelindo_min_time_thursday "late_min_time_thursday",
        a.late_pelindo_min_time_friday "late_min_time_friday",
        a.late_pelindo_min_time_saturday "late_min_time_saturday",
        a.late_pelindo_max_time_sunday "late_max_time_sunday",
        a.late_pelindo_max_time_monday "late_max_time_monday",
        a.late_pelindo_max_time_tuesday "late_max_time_tuesday",
        a.late_pelindo_max_time_wednesday "late_max_time_wednesday",
        a.late_pelindo_max_time_thursday "late_max_time_thursday",
        a.late_pelindo_max_time_friday "late_max_time_friday",
        a.late_pelindo_max_time_saturday "late_max_time_saturday",
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
        l_sun.provinsi AS "sunday_provinsi",
        -- Image
        il.image_log_id as "image_log_id",
        ip.hi_res_clockin_path as "hi_res_clockin_path",
        ip.hi_res_clockout_path as "hi_res_clockout_path" 
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
    LEFT JOIN "Location" l_sun ON l_sun.location_id = a.location_sunday_id
    LEFT JOIN "ImageLog" il ON il.user_id = u.user_id
    LEFT JOIN "ImagePair" ip ON ip.image_pair_id = il.image_pair_id;
  `);

    for (let i = 0; i < userAttandend.length; i++) {
      const user = userAttandend[i];

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
      const loc_lokasi = user[dayLokasiKey];
      const loc_alamat = user[dayAlamatKey];
      const loc_state = user[dayStateKey];
      const loc_provinsi = user[dayProvinsiKey];
      const late_min_time = Number(user[lateMinTimeKey]);
      const late_max_time = Number(user[lateMaxTimeKey]);
      const randomTime = getRandomMinutes(late_min_time, late_max_time);
      const scheduleTime = new Date(new Date().getTime() + randomTime * 60_000);

      if (is_do_attandence == true) {
        logger.info(
          `[mypelindo.providers.ts] Doing attendance for ${user.username} day: ${currentDay} hour: ${scheduleTime}`
        );

        const imageCount = await prisma.imagePair.count({
          where: { user_id: user.user_id },
        });
        if (imageCount == 0) continue;
        let imageForAttendance = '';

        // Kalau absen masuk, random image
        // Kalau absen masuk, pastikan id image lognya ada, kalau belum ada bikin dulu
        if (attandendType == 'absen_masuk') {
          const imageData = await prisma.imagePair.findMany({
            where: { user_id: user.user_id },
          });
          let randomImage = getRandomMinutes(0, imageData.length - 1);
          imageForAttendance = imageData[randomImage].hi_res_clockin_path!;

          const safeSearchLimit = 10;
          let safeSearchCount = 0;
          while (
            safeSearchCount < safeSearchLimit &&
            imageForAttendance == user.hi_res_clockin_path
          ) {
            logger.info(
              `[mypelindo.providers.ts] Try finding other image for ${user.username}, ${safeSearchCount} times`
            );
            randomImage = getRandomMinutes(0, imageData.length - 1);
            imageForAttendance = imageData[randomImage].hi_res_clockin_path!;
            safeSearchCount++;
          }

          if (user.image_log_id == null) {
            const imageLog = await prisma.imageLog.create({
              data: {
                user_id: user.user_id,
                image_pair_id: imageData[randomImage].image_pair_id,
              },
            });
          }
          if (user.image_log_id != null) {
            await prisma.imageLog.update({
              where: {
                image_log_id: user.image_log_id,
                user_id: user.user_id,
              },
              data: {
                image_pair_id: imageData[randomImage].image_pair_id,
              },
            });
          }
        }

        // Kalau absen pulang, ambil image terakhir
        // Kalau absen pulang, pastikan id image lognya ada, kalau belum ada langsung random
        if (attandendType == 'absen_pulang' && user.image_log_id != null) {
          imageForAttendance = user.hi_res_clockout_path!;
        }

        if (attandendType == 'absen_pulang' && user.image_log_id == null) {
          const imageData = await prisma.imagePair.findMany({
            where: { user_id: user.user_id },
          });
          let randomImage = getRandomMinutes(0, imageData.length - 1);
          imageForAttendance = imageData[randomImage].hi_res_clockin_path!;
        }

        if (imageForAttendance == '') continue;

        const lat =
          String(loc_lokasi).split(',')[0]?.length > 8
            ? String(loc_lokasi).split(',')[0].slice(0, 8) +
              String(getRandomMinutes(0, 9))
            : String(loc_lokasi).split(',')[0];
        const lng =
          String(loc_lokasi).split(',')[1]?.length > 10
            ? String(loc_lokasi).split(',')[1].slice(0, 10) +
              String(getRandomMinutes(0, 9))
            : String(loc_lokasi).split(',')[1];

        const absenPayload: MyPelindoAttendenceRequest = {
          LAT: lat,
          LNG: lng,
          TR_DATE: formatScheduleTime(scheduleTime),
          LOKASI: `${loc_alamat}`,
          KOMENTAR: 'null',
          PROGRAME_NAME: user?.device_name || 'Android 15',
          TIPE: attandendType == 'absen_masuk' ? 1 : 2,
          GAMBAR: 'src/' + imageForAttendance!,
        };

        const taskId = crypto.randomUUID();
        Scheduler.setTask(
          scheduleTime,
          () => {
            userDoLoginPelindo({
              username: user.eoffice_username,
              password: decryptText(user.eoffice_password),
            }).then((v) => {
              if (v.success) {
                userDoAttandendPelindo({
                  attandendData: absenPayload,
                  token: v.token,
                  cookies: v.jsessionid,
                });
              }
            });
          },
          taskId
        );

        bulkData.push({
          task_id: taskId,
          task_time: scheduleTime,
          user_id: user.user_id,
          task_data: JSON.parse(JSON.stringify(absenPayload)),
          scheduler_type: 'MYPELINDO',
        });
      }
    }
    await prisma.scheduler.createMany({ data: bulkData });
  } catch (error) {
    logger.error(
      '[mypelindo.providers.ts] wakeupMyPelindoAttendance Failed; Error detail:'
    );
    logger.error(error);
  }
}
