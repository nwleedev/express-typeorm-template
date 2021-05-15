import { getConnection } from 'typeorm';
import { CreateUserDto } from '../../dto/user';
import { User } from '../../entity/User';
import { hashPassword } from '../../static/auth';

export const createUser = async (data: CreateUserDto) => {
  const { email, username, password } = data;
  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({ email });
  if (user) {
    return null;
  }
  const hashed = await hashPassword(password);
  const newUser = new User();
  newUser.email = email;
  newUser.username = username;
  newUser.password = hashed;
  await newUser.save();
  return newUser;
};
