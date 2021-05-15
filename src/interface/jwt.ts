import * as jwt from 'jsonwebtoken';

export interface IJWTResponse {
  err: jwt.VerifyErrors;
  decoded: any;
}
