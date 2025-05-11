import AlertCard from '../component/alert.comp';
import Button from '../component/button.comp';
import PassowrdInput from '../component/password.input';
import SocialButton from '../component/socialbutton.comp';
import TextInput from '../component/text.input.comp';

export default function MyPelindoPage() {
  return (
    <div
      class={
        'w-full md:w-1/2 lg:w-1/4 h-full mx-auto p-4 flex flex-col justify-center'
      }
    >
      <h1 class={'mb-10'}>Sync With MyPelindo</h1>

      <p class={'mb-2'}>Type your MyPelindo username and password</p>

      <form>
        <TextInput
          formName="input-username"
          iconPath="/public/img/icon/email.svg"
          placeholder="Type your username"
        />

        <PassowrdInput
          formName="input-password"
          iconPath="/public/img/icon/lock.svg"
          placeholder="Type your password"
        />

        <TextInput
          formName="input-device"
          iconPath="/public/img/icon/phone.svg"
          placeholder="Type your device"
        />

        <Button buttonName="button-sync" placeholder="Sync" />
      </form>
    </div>
  );
}
