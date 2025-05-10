interface Role {
  IDAPLIKASI: string;
  IDROLE: string;
  NAMAROLE: string;
}

interface RoleList {
  ROLE: Role[];
}

interface RolePortalSI {
  ID_APLIKASI: string;
  NAMA_APLIKASI: string;
  ROLE_LIST: RoleList;
}

interface MyPelindoUserResponse {
  IDACCOUNT: string;
  ROLE: string;
  NIP: string;
  NICK: string;
  NAME: string;
  AVATAR: string | null;
  POSITIONCODE: string;
  POSITION: string;
  BRANCHCODE: string;
  BRANCH: string;
  DITCODE: string | null;
  DIT: string | null;
  SUBDITCODE: string;
  SUBDIT: string;
  DEPARTMENTCODE: string | null;
  DEPARTMENT: string | null;
  TERMINALCODE: string;
  LASTSEEN: string;
  REGISTERDATE: string;
  STATUS: string;
  EMAIL: string;
  USERIDPSI: string;
  JENPEG: string | null;
  NAMA_JENPEG: string | null;
  PERSONAL_SUB_AREA: string;
  PERSONAL_AREA: string;
  KNOWLEDGE_POINT: string;
  PERFORMANCE_POINT: string;
  RECOGNITION_POINT: string;
  HAKAKSES_DESC: string | null;
  AVATAR_BIG: string | null;
  HP: string;
  IS_ACTIVE: string;
  DHC_PENYAKIT_KORMOBID: string | null;
  DHC_ALAMAT: string | null;
  DHC_KECAMATAN: string | null;
  DHC_KABUPATEN_KOTA: string | null;
  DHC_STATUS: string | null;
  DHC_PENYAKIT_KORMOBID_LAINNYA: string | null;
  DHC_POSITIF: string;
  DHC_POSITIF_LOKASI: string | null;
  IS_REGISTER: string;
  COMPANY_CODE: string;
  PROFILE_MODE: string;
  TANOS_TOKEN: string;
  ROLEPORTALSI: RolePortalSI[];
  ACCESSTOKEN: string;
  AUTHKEY: string;
  PROFIL_INFO: string | null;
  ADDRESS: string | null;
}

export async function userDoLoginPelindo({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<[boolean, string]> {
  const authorizationBase64 = Buffer.from(`${username}:${password}`).toString(
    'base64'
  );
  const reqBody = new URLSearchParams();

  const resp = await fetch('https://my.api.pelindo.co.id/auth', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'okhttp/4.9.2',
      Accept: 'application/json, text/plain, */*',
      Authorization: `Basic ${authorizationBase64}`,
    },
    method: 'POST',
    body: reqBody,
    credentials: 'include',
  });

  const httpRespData = (await resp.json()) as MyPelindoUserResponse;

  return [
    resp.status == 200 ? true : false,
    resp.status == 200 ? httpRespData.ACCESSTOKEN : '',
  ];
}
