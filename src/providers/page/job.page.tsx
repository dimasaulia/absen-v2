import AlertCard from '../component/alert.comp';
import Button from '../component/button.comp';
import PassowrdInput from '../component/password.input';
import SelectInput, { SelectOption } from '../component/select.input';
import SocialButton from '../component/socialbutton.comp';
import TextInput from '../component/text.input.comp';

export default function JobPage({ job }: { job: SelectOption[] }) {
  return (
    <div
      class={
        'w-full md:w-1/2 lg:w-1/4 h-full mx-auto p-4 flex flex-col justify-center'
      }
    >
      <h1 class={'mb-10'}>Set Your Job</h1>

      <p class={'mb-2'}>
        Jenis pekerjaan yang dipilih akan mempengaruhi aktivitas yang digunakan
        saat absen pulang
      </p>

      <form>
        <SelectInput data={job} id="input-job" />

        <Button buttonName="button-save" placeholder="Save" />
      </form>
    </div>
  );
}
