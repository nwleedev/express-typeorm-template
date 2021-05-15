import * as bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { VerifyEmailDto } from '../../dto/user';
import { UserVerify } from '../../entity/UserVerify';

export const verifyEmail = async (verifyEmailDto: VerifyEmailDto) => {
  const { email, token } = verifyEmailDto;
  const verifyRepository = getConnection().getRepository(UserVerify);
  const verifyData = await verifyRepository.findOne({ email });
  if (!verifyData) {
    return null;
  }
  const isMatch = await bcrypt.compare(token, verifyData.token);
  if (!isMatch) {
    return null;
  } else if (verifyData.expiredAt < new Date()) {
    return null;
  }
  verifyData.verifiedAt = new Date();
  await verifyData.save();
  return verifyData;
};
