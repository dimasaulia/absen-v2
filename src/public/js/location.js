const mapContainer = document.getElementById('map');
const locationContainer = document.getElementById('location-container');
const MAP = L.map('map');
const inputNameForm = document.getElementById('input-name');
const inputKordinatForm = document.getElementById('input-lokasi');
const inputStateForm = document.getElementById('input-state');
const inputProvinsiForm = document.getElementById('input-provinsi');
const inputAlamatForm = document.getElementById('input-alamat');
const button = document.getElementById('button-save');

let marker;

let googleSat = L.tileLayer(
  'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }
);
googleSat.addTo(MAP);

if ('geolocation' in navigator) {
  /* geolocation is available */
  navigator.geolocation.getCurrentPosition(async (position) => {
    mapContainer.classList.remove('flex');
    mapContainer.classList.remove('justify-center');
    mapContainer.classList.remove('items-center');
    mapContainer.removeChild(mapContainer.children[0]);
    MAP.setView([position.coords.latitude, position.coords.longitude], 17);

    MAP.on('click', async function (e) {
      const lat = Number(Number(e.latlng.lat).toFixed(13));
      const lng = Number(Number(e.latlng.lng).toFixed(13));

      if (marker != null) {
        MAP.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(MAP);

      const locationReq = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
      );
      const locationResp = await locationReq.json();

      inputKordinatForm.value = `${lat},${lng}`;
      inputAlamatForm.value = locationResp['display_name'];
      inputStateForm.value = locationResp['address']['village'];
      inputProvinsiForm.value = locationResp['address']['city'];
    });
  });
} else {
  /* geolocation IS NOT available */
  Toastify({
    text: 'Warning Location Not Available',
    className: 'error',

    style: {
      background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
    },
  }).showToast();
}

button.addEventListener('click', async (e) => {
  e.preventDefault();

  const locationReqBody = {
    name: inputNameForm.value,
    lokasi: inputKordinatForm.value,
    alamat: inputAlamatForm.value,
    state: inputStateForm.value,
    provinsi: inputProvinsiForm.value,
  };

  const resp = await fetch('/api/locations/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(locationReqBody),
  });

  const dataResp = await resp.json();

  if (resp.status == 200) {
    locationContainer.insertAdjacentHTML(
      'beforeend',
      `
        <div class='bg-slate-100 border-2 border-slate-200 rounded-lg p-2 mb-4'>
          <p>${inputNameForm.value}</p>
        </div>
      `
    );

    inputNameForm.value = '';
    inputKordinatForm.value = '';
    inputAlamatForm.value = '';
    inputStateForm.value = '';
    inputProvinsiForm.value = '';

    Toastify({
      text: 'Sukses Menambahkan Lokasi',
      className: 'success',

      style: {
        background: 'linear-gradient(to right, #AAFFA9  0%, #11FFBD  100%)',
      },
    }).showToast();
  }

  if (resp.status != 200) {
    Toastify({
      text: dataResp.errors || dataResp.message || 'Gagal Menambahkan Lokasi',
      className: 'error',

      style: {
        background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
      },
    }).showToast();
  }
});
