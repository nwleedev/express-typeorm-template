export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface SendEmailDto {
  email: string;
  type: 'SIGNUP' | 'RESET';
}

export interface VerifyEmailDto {
  email: string;
  token: string;
}

export interface JWTTokenDto {
  accessToken: string;
  refreshToken: string;
}
