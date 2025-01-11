import { OAuth2Client } from 'oslo/oauth2';
export const redirectGoogleAuthEndpoint: string = '/api/users/google/callback';
export const tokenEndpoint = 'https://oauth2.googleapis.com/token';
export const googleOAuth2Client = new OAuth2Client(
  Bun.env.GOOGLE_CLIENT_ID || '',
  'https://accounts.google.com/o/oauth2/v2/auth',
  'https://oauth2.googleapis.com/token',
  {
    redirectURI: redirectGoogleAuthEndpoint,
  }
);
