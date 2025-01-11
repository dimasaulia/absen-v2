import AlertCard from '../component/alert.comp';
import Button from '../component/button.comp';
import PassowrdInput from '../component/password.input';
import SocialButton from '../component/socialbutton.comp';
import TextInput from '../component/text.input.comp';

export default function LoginPage() {
  return (
    <div
      class={
        'w-full md:w-1/2 lg:w-1/4 h-full mx-auto p-4 flex flex-col justify-center'
      }
    >
      <h1 class={'mb-10'}>Sign In</h1>

      <p class={'mb-2'}>Sign In With Open account</p>
      <div class={'flex mb-4'}>
        <SocialButton
          icon="/public/img/icon/google.svg"
          text="Google"
          href="/api/users/google"
        />
      </div>

      <p class={'mb-2'}>Or continue with email address</p>

      <form>
        <TextInput
          formName="input-usernameoremail"
          iconPath="/public/img/icon/email.svg"
          placeholder="Type your email or username"
        />

        <PassowrdInput
          formName="input-password"
          iconPath="/public/img/icon/lock.svg"
          placeholder="Type your password"
        />

        <Button buttonName="button-login" placeholder="Letsgooo" />
      </form>
    </div>
  );
}
