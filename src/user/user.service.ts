import { Context } from 'hono';
import { prisma } from '../providers/database.providers';
import { logger } from '../providers/logging.providers';
import {
  UserResponse,
  RegisterUserRequest,
  toUserResponse,
  GoogleUserResponse,
  LoginUserRequest,
  UserData,
  EofficeRequest,
  SetUserJobRequest,
} from './user.model';
import { UserValidation } from './user.validation';
import { HTTPException } from 'hono/http-exception';
import { generateState, OAuth2Client } from 'oslo/oauth2';
import { getCookie, setCookie } from 'hono/cookie';
import {
  googleOAuth2Client,
  redirectGoogleAuthEndpoint,
  tokenEndpoint,
} from '../providers/gapi.providers';
import { decode, sign, verify } from 'hono/jwt';
import { userDoLogin } from '../providers/attendance.providers';
import { encryptText } from '../providers/encription.providers';
import { User } from '@prisma/client';

export class UserService {
  static async register(
    request: RegisterUserRequest
  ): Promise<UserResponse | null> {
    // Validasi request
    if (request.provider === 'MANUAL') {
      request = UserValidation.REGISTER.parse(request);
    }

    if (request.provider === 'GOOGLE') {
      request = UserValidation.REGISTER_GOOGLE.parse(request);
    }

    // Cek apakah ada di db
    const totalUser = await prisma.user.count({
      where: { OR: [{ username: request.username }, { email: request.email }] },
    });

    if (totalUser != 0 && request.provider == 'MANUAL') {
      throw new HTTPException(400, {
        message: 'User already exists',
      });
    }

    // hash
    request.password = await Bun.password.hash(request.password!, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    // Save ke database
    let user: User | null = null;
    if (totalUser == 0) {
      user = await prisma.user.create({
        data: {
          username: request.username,
          password: request.password,
          email: request.email,
          full_name: request.name,
          password_updated_at: new Date(Date.now() - 1000),
          provider: request.provider,
          provider_id: request.provider_id,
          role: {
            connectOrCreate: {
              where: { name: 'BASE' },
              create: { name: 'BASE' },
            },
          },
        },
      });
    }

    return user ? toUserResponse(user) : null;
  }

  static async login(
    c: Context,
    request: LoginUserRequest
  ): Promise<UserResponse> {
    // Validasi request
    if (request.provider === 'MANUAL') {
      request = UserValidation.LOGIN.parse(request);
    }

    let isUserMatch: boolean = false;
    console.log('EMAIL => ', request.emailOrUsername);
    const user = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        password: true,
        full_name: true,
        provider: true,
        role: {
          select: {
            name: true,
          },
        },
      },
      where: {
        OR: [
          { username: request.emailOrUsername },
          { email: request.emailOrUsername },
        ],
      },
    });

    if (user.length === 0) {
      throw new HTTPException(400, {
        message: 'Username, email or password not match, or no user',
      });
    }
    if (request.provider === 'MANUAL') {
      isUserMatch = await Bun.password.verify(
        request.password!,
        user[0].password!
      );
    }

    if (request.provider === 'GOOGLE') {
      isUserMatch = true;
    }

    if (!isUserMatch) {
      throw new HTTPException(400, {
        message: 'Username, email or password not match',
      });
    }

    const response: UserResponse = {
      username: user[0].username,
      name: user[0].full_name,
      role: user[0].role.name,
    };

    response.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Token expires in 1 day
    const encode = await sign(response, Bun.env.JWT_SECRET!);

    setCookie(c, 'Authorization', encode, {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // Expires in 1 day
    });

    return response;
  }

  static async logout(c: Context) {
    setCookie(c, 'Authorization', '', {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(Date.now() + 1), // Expires in 1 day
    });
  }

  static async getUserDetail(c: Context) {
    const userData: UserData = await c.get('userData');

    const user = await prisma.user.findUnique({
      select: {
        username: true,
        email: true,
        password: true,
        full_name: true,
        provider: true,
        job_id: true,
        role: {
          select: {
            name: true,
          },
        },
      },
      where: {
        username: userData.username,
      },
    });

    return user;
  }

  static async registerWithGoogle(c: Context): Promise<string> {
    const googleClientId = Bun.env.GOOGLE_CLIENT_ID || '';
    const googleBaseUrl: string =
      'https://accounts.google.com/o/oauth2/v2/auth';
    const protocol: string =
      Bun.env.ENV === 'PROD'
        ? 'https://'
        : new URL(c.req.url).protocol === 'https:'
        ? 'https://'
        : 'http://';
    const host: string = c.req.header()['host'];
    const redirectUrl = `${protocol}${host}${redirectGoogleAuthEndpoint}`;
    const googleOAuth2State = generateState();

    const url = new URL(googleBaseUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('redirect_uri', redirectUrl);
    url.searchParams.set('state', googleOAuth2State);
    url.searchParams.set('client_id', googleClientId);
    url.searchParams.set('prompt', 'select_account');

    logger.info(`GOOGLE AUTH URL => ${url}`);

    setCookie(c, 'google_oauth2_state', googleOAuth2State, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60,
    });

    return url.toString();
  }

  static async getGoogleInfo(
    isLogin: boolean,
    c: Context
  ): Promise<GoogleUserResponse> {
    const { state, code } = c.req.query();

    const protocol: string =
      Bun.env.ENV === 'PROD'
        ? 'https://'
        : new URL(c.req.url).protocol === 'https:'
        ? 'https://'
        : 'http://';
    const host: string = c.req.header()['host'];
    const redirectUrl = `${protocol}${host}${redirectGoogleAuthEndpoint}`;

    const googleOAuth2State = getCookie(c, 'google_oauth2_state');

    if (!googleOAuth2State || !state || googleOAuth2State !== state) {
      throw new HTTPException(400, {
        message: 'Failed to authenticate request',
      });
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('User-Agent', 'oslo');

    const urlencoded = new URLSearchParams();
    urlencoded.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
    urlencoded.append('code', code);
    urlencoded.append('client_id', process.env.GOOGLE_CLIENT_ID!);
    urlencoded.append('grant_type', 'authorization_code');
    urlencoded.append('redirect_uri', redirectUrl);

    const request = new Request(tokenEndpoint, {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    });

    const res = await fetch(request);
    const result = await res.json();

    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${result.access_token}` },
      }
    );

    return (await response.json()) as GoogleUserResponse;
  }

  static async syncEoffice(
    request: EofficeRequest,
    c: Context
  ): Promise<[string, Boolean]> {
    const req: EofficeRequest = UserValidation.EOFFICE.parse(request);
    const userData: UserData = await c.get('userData');

    const [resp, _] = await userDoLogin(req.username, req.password);

    if (resp) {
      await prisma.user.update({
        data: {
          eoffice_username: req.username,
          eoffice_password: encryptText(req.password),
        },
        where: {
          user_id: userData.user_id,
        },
      });
    }

    return resp
      ? ['Sukses Melakukan Integrasi Ke Eoffice', true]
      : ['Gagal Melakukan Integrasi Ke Eoffice', false];
  }

  static async setJob(c: Context): Promise<UserResponse> {
    const req: SetUserJobRequest = UserValidation.SET_USER_JOB.parse(
      await c.req.json()
    );
    const userData: UserData = await c.get('userData');

    const job = await prisma.job.count({ where: { job_id: +req.job_id } });

    if (job < 1)
      throw new HTTPException(500, {
        message: 'Data Job tidak ditemukan',
      });

    const user = await prisma.user.update({
      data: {
        job_id: +req.job_id,
      },
      where: {
        user_id: userData.user_id,
      },
    });

    return toUserResponse(user);
  }
}
