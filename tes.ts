import {
  userDoAttandendPelindo,
  userDoLoginPelindo,
} from './src/providers/mypelindo.providers';

userDoLoginPelindo({ username: '20001015825', password: 'Dimas1710*' })
  .then((value) => {
    console.log('Respon => ');
    console.log(value[0]);
    console.log(value[1]);
    if (value[0] == true) {
      console.log('Login Sukses, Lakukan Absensi');
      const token = value[1];

      userDoAttandendPelindo({
        token,
        attandendData: {
          LAT: '-6.17445',
          LNG: '106.8945617',
          TR_DATE: '05/10/2025 22:29:45',
          LOKASI:
            'Jl. Boulevard Raya No.1 Lantai P3 Block G3 - G5, Klp. Gading Tim., Kec. Klp. Gading, Jkt Utara, Daerah Khusus Ibukota Jakarta 14240, Indonesia',
          PROGRAME_NAME: 'Android 15',
          TIPE: 1,
          KOMENTAR: null,
          GAMBAR: 'src/public/img/storage/dimas/dimas.jpeg',
        },
      });
    }
  })
  .catch((e) => {
    console.log('Error => ', e);
  })
  .finally(() => {
    console.log('Selesai');
  });
