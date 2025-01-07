import { User } from '@prisma/client';

export type RegisterUserRequest = {
  username: string;
  email: string;
  password?: string;
  provider: 'GOOGLE' | 'MANUAL' | 'MANUAL_GOOGLE';
  name: string;
  provider_id?: string;
};

export type LoginUserRequest = {
  emailOrUsername: string;
  password?: string;
  provider: 'GOOGLE' | 'MANUAL' | 'MANUAL_GOOGLE';
};

export type UserResponse = {
  username: string;
  name: string;
  role: string;
  exp?: number;
  token?: string;
};

export type UserData = {
  user_id: string;
  job_id: number | null;
  username: string;
  name: string;
  role: string;
};

export type GoogleUserResponse = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

export type EofficeRequest = {
  username: string;
  password: string;
};

export type SetUserJobRequest = {
  job_id: Number;
};

export function toUserResponse(user: User): UserResponse {
  return {
    username: user.username,
    name: user.full_name,
    role: user.role_id,
  };
}
