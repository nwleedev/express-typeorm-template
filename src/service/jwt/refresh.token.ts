import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { UserToken } from '../../entity/UserToken';
import { IJWTResponse } from '../../interface/jwt';

export const refreshJWTToken = async (none: string) => {
  config();
  const tokenRepository = getConnection().getRepository(UserToken);
  const { refreshToken } = await tokenRepository.findOne({ none });
  const { decoded, err }: IJWTResponse | null = await new Promise((res, _) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
      {
        algorithms: ['HS256'],
      },
      (err, decoded) => {
        res({ err, decoded });
      },
    );
  });
  if (err) return null;
  const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });
  return { accessToken, decoded };
};
