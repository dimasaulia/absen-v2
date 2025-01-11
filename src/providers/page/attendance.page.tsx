import Button from '../component/button.comp';
import AttendanceCard from '../component/card.attendance.comp';
import { SelectOption } from '../component/select.input';
import TextInput from '../component/text.input.comp';
import SidebarLayout from '../layout/sidebar.layout';

export default function AttendancePage({
  location,
}: {
  location: SelectOption[];
}) {
  return (
    <>
      <h1 class={'mb-4'}>Atur Waktu Absensi</h1>
      <p class={'mb-6'}>
        Setiap hari proses absensi dapat diatur untuk berjalan pada waktu dan
        lokasi yang berbeda. Saran untuk weekday atur ke kantor dan weekend atur
        ke rumah
      </p>

      <form>
        <AttendanceCard
          id="attendance-monday"
          title="Senin"
          location={location}
        />
        <AttendanceCard
          id="attendance-tuesday"
          title="Selasa"
          location={location}
        />
        <AttendanceCard
          id="attendance-wednesday"
          title="Rabu"
          location={location}
        />
        <AttendanceCard
          id="attendance-thursday"
          title="Kamis"
          location={location}
        />
        <AttendanceCard
          id="attendance-friday"
          title="Jumat"
          location={location}
        />
        <AttendanceCard
          id="attendance-saturday"
          title="Sabtu"
          location={location}
        />
        <AttendanceCard
          id="attendance-sunday"
          title="Minggu"
          location={location}
        />

        <Button buttonName="button-save" placeholder="Save" />
      </form>
    </>
  );
}
