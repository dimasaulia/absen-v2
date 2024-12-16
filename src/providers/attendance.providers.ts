async function userDoLogin(
  username: string,
  password: string
): Promise<[boolean, any]> {
  console.log(`Executing Login to Eoffice for ${username}`);

  let isSuccessLogin = false;
  const reqBody = new URLSearchParams();
  reqBody.append('username', username);
  reqBody.append('password', password);

  const resp = await fetch('https://eoffice.ilcs.co.id/p2b/login/do_login', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    body: reqBody,
    credentials: 'include',
  });

  isSuccessLogin =
    String(resp.headers.get('refresh')).split(';')[1] ===
    'url=https://eoffice.ilcs.co.id/p2b/absensi/online'
      ? true
      : false;

  return [isSuccessLogin, resp.headers.get('set-cookie')];
}

async function userDoAttandend({
  attandendType,
  attandendData,
  cookies,
}: {
  attandendType: string;
  attandendData: { [key: string]: string };
  cookies: string;
}) {
  console.log('Executing Attandend Proccess');
  if (!['absen_masuk', 'absen_pulang'].includes(attandendType)) {
    return new Error('Pilihan metode absen tidak tersedia');
  }

  const reqBody = new URLSearchParams();
  if (attandendData != null || attandendData != undefined) {
    for (const key in attandendData) {
      reqBody.append(key, attandendData[key]);
    }
  }
  const myHeaders = new Headers();
  const regex = /(ci_session_p2b=[^;]+|TS01d515c4=[^;]+)/g;
  const setCookies = cookies.match(regex);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Cookie', setCookies?.join(';') || '');

  const resp = await fetch(
    `https://eoffice.ilcs.co.id/p2b/absensi/${attandendType}`,
    {
      headers: myHeaders,
      method: 'POST',
      body: reqBody,
      credentials: 'include',
    }
  );

  console.log('RESP => ');
  console.log(resp.headers.getSetCookie());
  console.log(await resp.text());
}
