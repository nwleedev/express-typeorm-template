import * as bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { LoginUserDto } from '../../dto/user';
import { User } from '../../entity/User';

export const login = async (loginUserDto: LoginUserDto) => {
  const { email, password } = loginUserDto;
  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};
