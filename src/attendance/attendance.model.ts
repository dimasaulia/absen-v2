import { JobActivityResponse } from '../activity/activity.model';

export type DetailLocation = {
  name: String;
  state: String;
  alamat: String;
  lokasi: String;
  provinsi: String;
};

export type Attendance = {
  day: String;
  min_time: Number;
  max_time: Number;
  location: DetailLocation;
};

export type AttendanceResponse = {
  activity: JobActivityResponse[];
  attendance: Attendance[];
};

export interface IUserWithAttendanceAndLocations {
  user_id: string;
  username: string;
  eoffice_username: string;
  eoffice_password: string;
  job_name: string;
  is_friday: boolean;
  is_monday: boolean;
  is_sunday: boolean;
  is_thursday: boolean;
  is_tuesday: boolean;
  is_wednesday: boolean;
  is_saturday: boolean;
  friday_name: string | null;
  friday_lokasi: string | null;
  friday_alamat: string | null;
  friday_state: string | null;
  friday_provinsi: string | null;
  monday_name: string | null;
  monday_lokasi: string | null;
  monday_alamat: string | null;
  monday_state: string | null;
  monday_provinsi: string | null;
  tuesday_name: string | null;
  tuesday_lokasi: string | null;
  tuesday_alamat: string | null;
  tuesday_state: string | null;
  tuesday_provinsi: string | null;
  wednesday_name: string | null;
  wednesday_lokasi: string | null;
  wednesday_alamat: string | null;
  wednesday_state: string | null;
  wednesday_provinsi: string | null;
  thursday_name: string | null;
  thursday_lokasi: string | null;
  thursday_alamat: string | null;
  thursday_state: string | null;
  thursday_provinsi: string | null;
  saturday_name: string | null;
  saturday_lokasi: string | null;
  saturday_alamat: string | null;
  saturday_state: string | null;
  saturday_provinsi: string | null;
  sunday_name: string | null;
  sunday_lokasi: string | null;
  sunday_alamat: string | null;
  sunday_state: string | null;
  sunday_provinsi: string | null;
  late_min_time_sunday: number | null;
  late_min_time_monday: number | null;
  late_min_time_tuesday: number | null;
  late_min_time_wednesday: number | null;
  late_min_time_thursday: number | null;
  late_min_time_friday: number | null;
  late_min_time_saturday: number | null;
  late_max_time_sunday: number | null;
  late_max_time_monday: number | null;
  late_max_time_tuesday: number | null;
  late_max_time_wednesday: number | null;
  late_max_time_thursday: number | null;
  late_max_time_friday: number | null;
  late_max_time_saturday: number | null;
}
