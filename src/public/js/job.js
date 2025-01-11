const inputJob = document.getElementById('select-input-job');
const buttonSave = document.getElementById('button-save');

async function setJob() {
  const userReq = await fetch('/api/users/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  const user = await userReq.json();
  if (user?.data?.job_id != null) {
    inputJob.value = user?.data?.job_id;
  }
}

setJob();

buttonSave.addEventListener('click', async (e) => {
  e.preventDefault();

  const resp = await fetch('/api/users/job', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      job_id: Number(inputJob.value),
    }),
  });

  const dataResp = await resp.json();

  if (resp.status != 200) {
    Toastify({
      text: dataResp.errors || dataResp.message || 'Gagal Mengatur Pekerjaan',
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }

  if (resp.status == 200) {
    Toastify({
      text: 'Sukses Menyimpan Jenis Pekerjaan',
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
