const inputUsernameOrEmail = document.getElementById('input-usernameoremail');
const inputPassword = document.getElementById('input-password');
const buttonLogin = document.getElementById('button-login');

buttonLogin.addEventListener('click', async (e) => {
  e.preventDefault();

  const resp = await fetch('/api/users/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      emailOrUsername: inputUsernameOrEmail.value,
      password: inputPassword.value,
    }),
  });

  const dataResp = await resp.json();

  if (resp.status != 200) {
    Toastify({
      text: dataResp.errors,
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }
});
