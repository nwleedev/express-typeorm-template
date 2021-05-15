import { Request, Response, Router } from 'express';
import {
  CreateUserDto,
  LoginUserDto,
  SendEmailDto,
  VerifyEmailDto,
} from '../dto/user';
import {
  validateCheckPassword,
  validateEmail,
  validateEmailToken,
  validateLogin,
  validatePassword,
  validateRegister,
} from '../middleware/validator';
import { checkEmail } from '../service/email/check';
import { createEmailToken } from '../service/email/create.token';
import { verifyEmail } from '../service/email/verify.token';
import { createUser } from '../service/user/create.user';
import { login } from '../service/user/login.user';
import { createJWTToken } from '../service/jwt/create.token';
import { verifyJWTToken } from '../service/jwt/verify.token';
import { refreshJWTToken } from '../service/jwt/refresh.token';
import { validationResult } from 'express-validator';
import { checkUser } from '../service/user/check.user';
import { auth } from '../middleware/authenticate';
import { deleteUser } from '../service/user/delete.user';
import { changePassword } from '../service/user/password/change.password';
import { resetPassword } from '../service/user/password/reset.password';
import { deleteRefreshToken } from '../service/jwt/delete.token';

const router = Router();

router.post(
  '/token/email',
  validateEmail,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: 'Invalid Information',
        errors,
      });
      return;
    }
    const { email, type }: SendEmailDto = req.body;
    const emailToken = await createEmailToken(email, type);
    if (!emailToken) {
      res.status(400).json({
        message: 'Request Again Please',
      });
      return;
    }
    res.status(201).json({
      message: 'Email verification token was sent.',
      emailToken,
    });
  },
);

router.post(
  '/token/verify-email',
  validateEmailToken,
  async (req: Request, res: Response) => {
    const verifyEmailDto: VerifyEmailDto = req.body;
    const verifyData = await verifyEmail(verifyEmailDto);
    if (!verifyData) {
      res.status(403).json({
        message: 'Email verification failed',
        verifyData: null,
      });
      return;
    }
    res.status(200).json({
      message: 'Email verification successed',
      verifyData,
    });
  },
);

router.post(
  '/signup',
  validateRegister,
  async (req: Request, res: Response) => {
    const userCreateDto: CreateUserDto = req.body;
    const isVerified = await checkEmail(userCreateDto.email);
    if (!isVerified) {
      res.status(401).json({
        message: 'The email is not verified',
        user: null,
      });
      return;
    }
    const user = await createUser(userCreateDto);
    if (!user) {
      res.status(401).json({
        message: 'The user with email exists.',
        user: null,
      });
      return;
    }
    res.status(201).json({
      message: 'A new user was created',
      user,
    });
  },
);

router.post('/signin', validateLogin, async (req: Request, res: Response) => {
  const loginUserDto: LoginUserDto = req.body;
  const user = await login(loginUserDto);
  if (!user) {
    res.status(403).json({
      message: 'Invalid Login Data',
    });
    return;
  }
  const tokens = await createJWTToken(user);
  const { password: _, ...data } = user;
  res.status(200).json({
    user: data,
    tokens,
  });
});

router.post('/signout', (req: Request, res: Response) => {
  const none = req.headers['none'] as string;
  const result = deleteRefreshToken(none);
  if (!result) {
    res.status(403).json({
      message: 'Invalid User Data',
    });
    return;
  }
  res.status(203).json({
    message: 'User Signed Out',
    result: result,
  });
});

router.post('/auth', async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const verified = await verifyJWTToken(accessToken);
  if (!verified) {
    res.status(403).json({
      message: 'Invalid Token',
    });
    return;
  }
  if (verified.err && verified.err.name !== 'TokenExpiredError') {
    res.status(403).json({
      message: 'Invalid Token',
      err: verified.err,
    });
    return;
  }
  if (verified.err && verified.err.name === 'TokenExpiredError') {
    const none = req.headers['none'] as string;
    const response = await refreshJWTToken(none);
    if (!response) {
      res.status(400).json({
        message: 'Login Please',
      });
      return;
    }
    const { accessToken: newAccessToken, decoded } = response;
    const { password, ...props } = await checkUser(decoded.id as number);
    res.status(200).json({
      message: 'Access Token Re-Created',
      user: props,
      accessToken: newAccessToken,
    });
    return;
  }
  const { decoded } = verified;
  const { password, ...props } = await checkUser(decoded.id as number);
  res.status(200).json({
    message: 'Authenticated',
    user: props,
    accessToken,
  });
});

router.post(
  '/delete',
  auth,
  validatePassword,
  async (req: Request, res: Response) => {
    const userId = req.user;
    const { password } = req.body;
    const user = await deleteUser(userId, password);
    if (!user) {
      res.status(400).json({
        message: 'User Deletion Failed',
      });
      return;
    }
    res.status(201).json({
      message: 'User Deleted',
      user,
    });
  },
);

// router.post(
//   '/password/check',
//   validateEmail,
//   async (req: Request, res: Response) => {
//     const { email, type }: SendEmailDto = req.body;
//     const isUser = await checkEmail(email);
//     if (!isUser) {
//       res.status(401).json({
//         message: 'No User with this email.',
//       });
//       return;
//     }
//     const data = await createEmailToken(email, type);
//     res.status(200).json({
//       message: 'Reset Token Sent',
//       ...data.data,
//       token: data.token,
//     });
//   },
// );

router.post(
  '/password/reset',
  validateCheckPassword,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await resetPassword(email, password);
    if (!user) {
      res.status(400).json({
        message: 'Password Not Changed',
      });
      return;
    }
    res.status(201).json({
      message: 'Password Changed',
      user,
    });
  },
);

router.post(
  '/password/change',
  auth,
  validatePassword,
  async (req: Request, res: Response) => {
    const userId = req.user;
    const { password } = req.body;
    const user = await changePassword(userId, password);
    if (!user) {
      res.status(400).json({
        message: 'User Deletion Failed',
      });
      return;
    }
    res.status(201).json({
      message: 'User Deleted',
      user,
    });
  },
);

export { router };
