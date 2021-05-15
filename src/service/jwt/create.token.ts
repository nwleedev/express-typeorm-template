import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { User } from '../../entity/User';
import { UserToken } from '../../entity/UserToken';

export const createJWTToken = async (user: User) => {
  config();
  const { id } = user;
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  const none = Math.random().toString(16).replace('0.', '');
  const savedToken = new UserToken();
  savedToken.none = none;
  savedToken.refreshToken = refreshToken;
  await savedToken.save();
  return { accessToken, none };
};
