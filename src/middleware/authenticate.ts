import { NextFunction, Request, Response } from 'express';
import { verifyJWTToken } from '../service/jwt/verify.token';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const verified = await verifyJWTToken(accessToken);
  if (!verified) {
    res.status(403).json({
      message: 'Invalid Token',
    });
    return;
  }
  if (verified.err && verified.err.name !== 'TokenExpiredError') {
    res.status(500).json({
      message: 'Invalid Token',
      err: verified.err,
    });
    return;
  }
  if (verified.err && verified.err.name === 'TokenExpiredError') {
    res.status(500).json({
      message: 'Access Token Expired',
      err: verified.err,
    });
    return;
  }
  const decoded = verified.decoded as any;
  const userId = decoded.id as number;
  req.user = userId;
  next();
};
