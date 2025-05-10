import { userDoLoginPelindo } from './src/providers/mypelindo.providers';

userDoLoginPelindo({ username: '20001015825', password: 'Dimas1710*' })
  .then((value) => {
    console.log('Respon => ');
    console.log(value[0]);
    console.log(value[1]);
  })
  .catch((e) => {
    console.log('Error => ', e);
  })
  .finally(() => {
    console.log('Selesai');
  });
