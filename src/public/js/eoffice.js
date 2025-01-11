const inputUsername = document.getElementById('input-username');
const inputPassword = document.getElementById('input-password');
const buttonSync = document.getElementById('button-sync');

buttonSync.addEventListener('click', async (e) => {
  e.preventDefault();

  const resp = await fetch('/api/users/eoffice', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      username: inputUsername.value,
      password: inputPassword.value,
    }),
  });

  const dataResp = await resp.json();

  if (resp.status != 200) {
    Toastify({
      text: dataResp.errors || dataResp.message || 'Gagal Melakukan Integrasi',
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }

  if (resp.status == 200) {
    Toastify({
      text: 'Sukses Melakukan Sinkronisasi',
      className: 'success',

      style: {
        background: 'linear-gradient(to right, #AAFFA9  0%, #11FFBD  100%)',
      },
    }).showToast();

    setTimeout(() => {
      window.location = '/dashboard/attendance';
    }, 2000);
  }
});
