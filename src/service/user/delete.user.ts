import * as bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { User } from '../../entity/User';

export const deleteUser = async (userId: number, password: string) => {
  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({ id: userId });
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  const deleted = await user.softRemove();
  return deleted;
};
