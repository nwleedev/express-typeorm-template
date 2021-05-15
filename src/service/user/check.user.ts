import { getConnection } from 'typeorm';
import { User } from '../../entity/User';

export const checkUser = async (id: number) => {
  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({ id });
  if (!user) {
    return null;
  }
  return user;
};
