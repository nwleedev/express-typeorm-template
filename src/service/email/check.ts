import { getConnection } from 'typeorm';
import { UserVerify } from '../../entity/UserVerify';

export const checkEmail = async (email: string) => {
  const verifyRepository = getConnection().getRepository(UserVerify);
  const verifyData = await verifyRepository.findOne({ email });
  if (!verifyData || !verifyData.verifiedAt) return false;
  return true;
};
