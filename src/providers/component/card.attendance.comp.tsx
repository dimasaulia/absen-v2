import SelectInput, { SelectOption } from './select.input';
import TextInput from './text.input.comp';

export default function AttendanceCard({
  id,
  title,
  location,
}: {
  id: string;
  title: string;
  location: SelectOption[];
}) {
  return (
    <div
      id={`card-${id}`}
      class={
        'bg-gray-100 border-2 border-blue-100 rounded-xl p-2 flex items-center mb-6'
      }
    >
      <h5 class={'text-blue-500 pe-2'}>{title}</h5>
      <div class={'ps-2 w-full border-s-2 border-gray-200'}>
        <label class={'mb-1 block'}>Atur Lokasi</label>
        <SelectInput id={id} data={location} />
        <div class={'flex w-full '}>
          <div class={'flex-1 pb-2 pe-2'}>
            <label class={'mb-1 block'}>Atur Delay Awal</label>
            <TextInput
              placeholder="Masukan Menit"
              iconPath="/public/img/icon/clock.svg"
              formName={`min_time`}
            />
          </div>

          <div class={'flex-1 pb-2 pe-2'}>
            <label class={'mb-1 block'}>Atur Delay Akhir</label>
            <TextInput
              placeholder="Masukan Menit"
              iconPath="/public/img/icon/clock.svg"
              formName={`max_time`}
            />
          </div>
        </div>

        <label class="inline-flex items-center cursor-pointer">
          <span class="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Aktif
          </span>
          <input type="checkbox" value="" class="sr-only peer" />
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}
