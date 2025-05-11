const button = document.getElementById('button-save');
const days = [
  'monday',
  'tuesday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

async function getAttendanceData() {
  const attendanceReq = await fetch('/api/attendance/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  const attendanceResp = await attendanceReq.json();
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const attendanceData = attendanceResp?.data?.attendance?.filter(
      (d) => d.day == day
    )[0];

    if (attendanceData) {
      const card = document.getElementById(`card-attendance-${day}`);
      const formContent = card.children[1];
      const locationForm = formContent.children[2];
      const locationValue = locationForm.value;
      const minTimeEofficeForm =
        formContent.children[4].children[0].children[1].children[1];
      const maxTimeEofficeForm =
        formContent.children[4].children[1].children[1].children[1];
      const minTimeMyPelindoForm =
        formContent.children[6].children[0].children[1].children[1];
      const maxTimeMyPelindoForm =
        formContent.children[6].children[1].children[1].children[1];
      const activeEofficeForm = formContent.children[7].children[1];
      const activePelindoForm = formContent.children[8].children[1];

      // Set Value
      locationForm.value = attendanceData['location']['id'];
      minTimeEofficeForm.value = attendanceData['min_time_eoffice'];
      maxTimeEofficeForm.value = attendanceData['max_time_eoffice'];
      minTimeMyPelindoForm.value = attendanceData['min_time_pelindo'];
      maxTimeMyPelindoForm.value = attendanceData['max_time_pelindo'];
      activeEofficeForm.checked = attendanceData['is_active_eoffice'];
      activePelindoForm.checked = attendanceData['is_active_pelindo'];
    }
  }
}

getAttendanceData();

button.addEventListener('click', async (e) => {
  e.preventDefault();
  button.textContent = '';
  button.insertAdjacentHTML(
    'beforeend',
    `
    <div role="status" class="flex justify-center items-center">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="ms-2">Loading...</span>
    </div>
    `
  );
  button.disabled = true;

  const attendanceReqBody = {
    via: 'WFS',
    kondisi: 'Sehat',
  };

  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    const card = document.getElementById(`card-attendance-${day}`);
    const formContent = card.children[1];
    const locationForm = formContent.children[2];
    const locationValue = locationForm.value;

    const minEofficeTimeForm =
      formContent.children[4].children[0].children[1].children[1];
    const maxEofficeTimeForm =
      formContent.children[4].children[1].children[1].children[1];
    const activeEofficeForm = formContent.children[7].children[1];

    const minPelindoTimeForm =
      formContent.children[6].children[0].children[1].children[1];
    const maxPelindoTimeForm =
      formContent.children[6].children[1].children[1].children[1];
    const activePelindoForm = formContent.children[8].children[1];

    attendanceReqBody[`attendance_eoffice_on_${day}`] =
      activeEofficeForm.checked;
    attendanceReqBody[`min_eoffice_time_${day}`] = Number(
      minEofficeTimeForm.value
    );
    attendanceReqBody[`max_eoffice_time_${day}`] = Number(
      maxEofficeTimeForm.value
    );

    attendanceReqBody[`attendance_pelindo_on_${day}`] =
      activePelindoForm.checked;
    attendanceReqBody[`min_pelindo_time_${day}`] = Number(
      minPelindoTimeForm.value
    );
    attendanceReqBody[`max_pelindo_time_${day}`] = Number(
      maxPelindoTimeForm.value
    );

    attendanceReqBody[`location_${day}`] = Number(locationValue);
  }

  const resp = await fetch('/api/attendance/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(attendanceReqBody),
  });

  const dataResp = await resp.json();
  button.textContent = 'Save';
  button.disabled = false;

  if (resp.status == 200) {
    Toastify({
      text: 'Sukses Set Absen',
      className: 'success',

      style: {
        background: 'linear-gradient(to right, #AAFFA9  0%, #11FFBD  100%)',
      },
    }).showToast();
  }

  if (resp.status != 200) {
    Toastify({
      text:
        dataResp.errors || dataResp.message || 'Gagal Melakukan Seting Absensi',
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }

  button.textContent = 'Save';
});
