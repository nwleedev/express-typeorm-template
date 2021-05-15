import { getConnection } from 'typeorm';
import { UserVerify } from '../../entity/UserVerify';
import { hashToken } from '../../static/auth';
import { sendEmailToken } from './send.token';

export const createEmailToken = async (email: string, type = 'SIGNUP') => {
  try {
    const verifyRepository = getConnection().getRepository(UserVerify);
    const isVerified = await verifyRepository.findOne({ email });
    const emailToken = !isVerified ? new UserVerify() : isVerified;
    const newToken = Math.random()
      .toString(16)
      .slice(2, 2 + 8);
    const hashedToken = await hashToken(newToken);
    emailToken.email = email;
    emailToken.token = hashedToken;
    emailToken.expiredAt = new Date(Date.now() + 1000 * 60 * 10);
    await emailToken.save();
    await sendEmailToken(email, newToken, type);

    const { token, ...data } = emailToken;
    return { data, token: newToken };
  } catch (err) {
    console.log(err);
    return null;
  }
};
