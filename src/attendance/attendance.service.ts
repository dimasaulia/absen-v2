import { Context } from 'hono';
import { UserData } from '../user/user.model';
import { prisma } from '../providers/database.providers';
import { Scheduler as IScheduler, Prisma } from '@prisma/client';
import {
  AttendanceResponse,
  IUserWithAttendanceAndLocations,
} from './attendance.model';

export class AttendanceService {
  static async getUserAttendance(c: Context) {
    const userData: UserData = c.get('userData');
    const result: AttendanceResponse = { activity: [], attendance: [] };
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const activities = await prisma.jobActivity.findMany({
      select: {
        name: true,
        job_activityid: true,
        job: { select: { name: true } },
      },
      where: {
        job_id: userData.job_id,
      },
    });

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      result.activity.push({
        job_name: activity.job?.name!,
        activity_id: activity.job_activityid!,
        activity_name: activity.name!,
      });
    }

    const userAttendances = await prisma.$queryRaw<
      IUserWithAttendanceAndLocations[]
    >(Prisma.sql`
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
        LEFT JOIN "Location" l_sun ON l_sun.location_id = a.location_sunday_id
        WHERE u.user_id = ${userData.user_id}
    `);

    const userAttendance = userAttendances[0];
    for (let i = 0; i < daysOfWeek.length; i++) {
      const day = daysOfWeek[i].toLocaleLowerCase();
      const lateMinTimeKey =
        `late_min_time_${day}` as keyof IUserWithAttendanceAndLocations;
      const lateMaxTimeKey =
        `late_max_time_${day}` as keyof IUserWithAttendanceAndLocations;
      const dayNameKey = `${day}_name` as keyof IUserWithAttendanceAndLocations;
      const dayLokasiKey =
        `${day}_lokasi` as keyof IUserWithAttendanceAndLocations;
      const dayAlamatKey =
        `${day}_alamat` as keyof IUserWithAttendanceAndLocations;
      const dayStateKey =
        `${day}_state` as keyof IUserWithAttendanceAndLocations;
      const dayProvinsiKey =
        `${day}_provinsi` as keyof IUserWithAttendanceAndLocations;
      console.log(userAttendance.late_max_time_tuesday, lateMaxTimeKey);
      result.attendance.push({
        day: day,
        min_time: userAttendance[lateMinTimeKey] as Number,
        max_time: userAttendance[lateMaxTimeKey] as Number,
        location: {
          name: userAttendance[dayNameKey] as string,
          state: userAttendance[dayStateKey] as string,
          alamat: userAttendance[dayAlamatKey] as string,
          lokasi: userAttendance[dayLokasiKey] as string,
          provinsi: userAttendance[dayProvinsiKey] as string,
        },
      });
    }

    return result;
  }
}
