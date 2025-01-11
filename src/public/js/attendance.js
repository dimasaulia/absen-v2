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
      const formContent = card.children[1];
      const locationForm = formContent.children[1];
      const locationValue = locationForm.value;
      const minTimeForm =
        formContent.children[2].children[0].children[1].children[1];
      const maxTimeForm =
        formContent.children[2].children[1].children[1].children[1];
      const activeForm = formContent.children[3].children[1];

      // Set Value
      locationForm.value = attendanceData['location']['id'];
      minTimeForm.value = attendanceData['min_time'];
      maxTimeForm.value = attendanceData['max_time'];
      activeForm.checked = attendanceData['is_active'];
    }
  }
}

getAttendanceData();

button.addEventListener('click', async (e) => {
  e.preventDefault();

  const attendanceReqBody = {
    via: 'WFS',
    kondisi: 'Sehat',
  };

  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    const card = document.getElementById(`card-attendance-${day}`);
    const formContent = card.children[1];
    const locationForm = formContent.children[1];
    const locationValue = locationForm.value;
    const minTimeForm =
      formContent.children[2].children[0].children[1].children[1];
    const maxTimeForm =
      formContent.children[2].children[1].children[1].children[1];
    const activeForm = formContent.children[3].children[1];

    attendanceReqBody[`attendance_on_${day}`] = activeForm.checked;
    attendanceReqBody[`min_time_${day}`] = Number(minTimeForm.value);
    attendanceReqBody[`max_time_${day}`] = Number(maxTimeForm.value);
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
});
