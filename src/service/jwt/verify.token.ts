import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { IJWTResponse } from '../../interface/jwt';

export const verifyJWTToken = async (accessToken: string) => {
  config();
  const result: IJWTResponse | null = await new Promise(
    (res: (_: IJWTResponse) => void, _) => {
      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY,
        {
          algorithms: ['HS256'],
        },
        (err, decoded) => {
          res({ err, decoded });
        },
      );
    },
  ).catch((err) => null);
  return result;
};
