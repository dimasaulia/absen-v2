const inputActivity = document.getElementById('input-activity');
const activityContainer = document.getElementById('activiy-container');
const buttonAdd = document.getElementById('button-add');

buttonAdd.addEventListener('click', async (e) => {
  e.preventDefault();

  const resp = await fetch('/api/job/activity', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      activity_name: inputActivity.value,
    }),
  });

  const dataResp = await resp.json();

  if (resp.status != 201) {
    Toastify({
      text:
        dataResp.errors || dataResp.message || 'Gagal Menambahkan Aktivitas',
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }

  if (resp.status == 201) {
    activityContainer.insertAdjacentHTML(
      'beforeend',
      `
        <div class='bg-slate-100 border-2 border-slate-200 rounded-lg p-2 mb-4'>
          <p>${inputActivity.value}</p>
        </div>
      `
    );
  }

  inputActivity.value = '';
});
