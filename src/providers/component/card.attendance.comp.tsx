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
        'bg-gray-100 border-2 border-blue-100 rounded-xl p-2 flex flex-col md:flex-row items-center mb-6'
      }
    >
      <h5 class={'text-blue-500 pe-2'}>{title}</h5>
      <div
        class={
          'ps-0 pt-2 md:ps-2 md:pt-0 w-full border-s-0 border-t-2 md:border-t-0 md:border-s-2 md:border-gray-200'
        }
      >
        <h4 class={'text-gray-600'}>Lokasi</h4>
        <label class={'mb-2 block text-gray-500'}>
          Atur Lokasi Eoffice dan MyPelindo
        </label>
        <SelectInput id={id} data={location} />

        <h4 class={'text-gray-600'}>Delay Eoffice</h4>
        <div class={'flex w-full text-gray-500'}>
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

        <h4 class={'text-gray-600'}>Delay MyPelindo</h4>
        <div class={'flex w-full text-gray-500'}>
          <div class={'flex-1 pb-2 pe-2'}>
            <label class={'mb-1 block'}>Atur Delay Awal</label>
            <TextInput
              placeholder="Masukan Menit"
              iconPath="/public/img/icon/clock.svg"
              formName={`pelindo_min_time`}
            />
          </div>

          <div class={'flex-1 pb-2 pe-2'}>
            <label class={'mb-1 block'}>Atur Delay Akhir</label>
            <TextInput
              placeholder="Masukan Menit"
              iconPath="/public/img/icon/clock.svg"
              formName={`pelindo_max_time`}
            />
          </div>
        </div>

        <label class="inline-flex items-center cursor-pointer mb-3 me-5">
          <span class="me-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            Eoffice
          </span>
          <input type="checkbox" value="" class="sr-only peer" />
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>

        <label class="inline-flex items-center cursor-pointer mb-3">
          <span class="me-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            MyPelindo
          </span>
          <input type="checkbox" value="" class="sr-only peer" />
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}
