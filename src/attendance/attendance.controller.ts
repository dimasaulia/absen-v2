import { Hono } from 'hono';
import { apiAuthMiddleware } from '../middleware/user.middleware';
import { AttendanceService } from './attendance.service';

export const attendanceController = new Hono();

attendanceController.use(apiAuthMiddleware);

attendanceController.get('/', async (c) => {
  const response = await AttendanceService.getUserAttendance(c);
  c.status(200);
  return c.json({
    messages: 'Berhasil Mendapatkan Data',
    data: response,
  });
});

attendanceController.post('/', async (c) => {
  const response = await AttendanceService.setUserAttendance(c);
  c.status(200);
  return c.json({
    messages: 'Berhasil Menambahkan Data',
    data: response,
  });
});
