console.log('image.js');
const pendingImage = [];
const imageForm = document.getElementById('dropzone-file');
const pendingImageContainer = document.getElementById('pending-container');
const imageGaleryContainer = document.getElementById('image-galery');
const closeContainer = document.querySelectorAll('.close-container');
const uploadButton = document.getElementById('upload');
let pendingImageContainerCount = 0;

closeContainer.forEach((c) => {
  c.addEventListener('click', (e) => {
    alert('Gak bisa di hapus, males bikin fitur nya');
  });
});
function ImageContainer({ id, clock_in, clock_out }) {
  console.log(clock_in);
  return `
    <div
        class=
          'bg-blue-50 py-3 px-5 rounded-md w-full sm:w-full md:w-[300px] me-4 mb-4'
      >
        <h5 class='mb-2 text-slate-600'>Image Pair #${id}</h5>
        <div class='flex justify-around md:justify-between'>
          <div class='flex flex-col content-end'>
            <img class='rounded-md w-28 me-10' src="${clock_in}" alt="" />
            <h6 class='text-blue-400 font-semibold mt-auto'>Clock In</h6>
          </div>

          <div class='flex flex-col content-end'>
            <img class='rounded-md w-28' src="${clock_out}" alt="" />
            <h6 class='text-blue-400 font-semibold mt-auto'>Clock Out</h6>
          </div>
        </div>
      </div>
    `;
}

imageForm.addEventListener('change', (e) => {
  e.preventDefault();
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let clockType = 'clock-out';
      if (pendingImage.length == 10) {
        alert('Maksimal 10 Poto dulu gez');
        return;
      }
      if (pendingImage.length % 2 == 0) {
        pendingImageContainerCount += 1;
        clockType = 'clock-in';
      }
      const imgElement = document.getElementById(
        `${clockType}-${pendingImageContainerCount}`
      );
      imgElement.src = e.target.result;
      imgElement.style.display = 'block';
      pendingImage.push(file);
    };
    reader.readAsDataURL(file);
  }
});

uploadButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (pendingImage.length == 0) {
    alert('Upload foto nya dulu gez');
    return;
  }

  if (pendingImage.length % 2 != 0) {
    alert('Kurang 1 Foto Lagi');
    return;
  }

  uploadButton.textContent = '';
  uploadButton.insertAdjacentHTML(
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
  uploadButton.disabled = true;

  const formData = new FormData();
  let clock_counter = 1;
  for (let i = 0; i < pendingImage.length; i++) {
    const image = pendingImage[i];
    if (i % 2 != 0) {
      formData.append(`file_${clock_counter}_clockout`, image);
      clock_counter++;
    }
    if (i % 2 == 0) {
      formData.append(`file_${clock_counter}_clockin`, image);
    }
  }

  fetch('/api/image/', {
    method: 'POST',
    body: formData,
  })
    .then((r) => {
      if (r.ok) {
        Toastify({
          text: 'Sukses Upload Image',
          className: 'success',

          style: {
            background: 'linear-gradient(to right, #AAFFA9  0%, #11FFBD  100%)',
          },
        }).showToast();

        fetch('/api/image/', { method: 'GET' }).then(async (d) => {
          if (d.ok) {
            imageGaleryContainer.textContent = '';
            const respData = await d.json();

            for (let i = 0; i < respData?.data?.length; i++) {
              const data = respData?.data[i];
              imageGaleryContainer.insertAdjacentHTML(
                'beforeend',
                ImageContainer({
                  id: i + 1,
                  clock_in: data?.clock_in_image_path,
                  clock_out: data?.clock_out_image_path,
                })
              );
            }
          }
        });
      } else {
        Toastify({
          text: 'Upload Failed',
          className: 'error',

          style: {
            background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
          },
        }).showToast();
      }
    })
    .catch((e) => {
      console.log('Error Uploading File: ', e);
      Toastify({
        text: `Error: ${e}`,
        className: 'error',

        style: {
          background: 'linear-gradient(to right, #b31217  0%, #e52d27  100%)',
        },
      }).showToast();
    })
    .finally(() => {
      uploadButton.textContent = 'Upload';
      uploadButton.disabled = false;
      let counter = 0;
      for (let i = 0; i < pendingImage.length; i++) {
        let clockType = 'clock-out';
        if (i % 2 == 0) {
          counter += 1;
          clockType = 'clock-in';
        }
        console.log('ID => ', `${clockType}-${counter}`);
        const imgElement = document.getElementById(`${clockType}-${counter}`);
        imgElement.src = '';
      }
      pendingImage.length = 0;
    });
});
