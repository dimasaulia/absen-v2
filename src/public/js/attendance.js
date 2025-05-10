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
  // console.log(attendanceResp.data.attendance);
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const attendanceData = attendanceResp?.data?.attendance?.filter(
      (d) => d.day == day
    )[0];

    if (attendanceData) {
      const card = document.getElementById(`card-attendance-${day}`);
      console.log('Content');
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
      console.log(minTimeMyPelindoForm);

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
  button.textContent = 'Loading';
  e.preventDefault();

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

  console.log(attendanceReqBody);
  const resp = await fetch('/api/attendance/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(attendanceReqBody),
  });

  const dataResp = await resp.json();

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
