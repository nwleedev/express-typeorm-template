import { getConnection } from 'typeorm';
import { User } from '../../../entity/User';
import { hashPassword } from '../../../static/auth';

export const resetPassword = async (email: string, newPassword: string) => {
  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({ email });
  if (!user) {
    return null;
  }
  const newHashed = await hashPassword(newPassword);
  user.password = newHashed;
  await user.save();
  return user;
};
