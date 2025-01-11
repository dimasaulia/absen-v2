import { JobActivityResponse } from '../../activity/activity.model';
import ActivityCard from '../component/activity.comp';
import Button from '../component/button.comp';
import TextInput from '../component/text.input.comp';

export default function ActivityPage({
  activity,
}: {
  activity: JobActivityResponse[];
}) {
  return (
    <div>
      <h1 class={'mb-4'}>Daftar Aktivitas</h1>
      <p class={'mb-6'}>
        Daftar aktivitas berdasarkan pekerjaan yang anda pilih. Aktivitas ini
        akan di acak dan digunkan untuk mengisi kegiatan saat absen pulang. Anda
        jug dapat menambahkan aktivitas, aktivitas ini bersifat unik dan tidak
        akan bisa digunakan oleh pengguna lain
      </p>

      <div class={'flex'}>
        <div class={'w-5/6 me-2'}>
          <TextInput
            placeholder="Masukan Aktivitas"
            formName="input-activity"
            iconPath="/public/img/icon/activity.svg"
          />
        </div>
        <div class={'mb-6 w-1/6'}>
          <Button placeholder="Add" buttonName="button-add" />
        </div>
      </div>

      <div id="activiy-container">
        {activity.map((a) => (
          <ActivityCard text={a.activity_name} />
        ))}
      </div>
    </div>
  );
}
