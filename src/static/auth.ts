import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
};

export const hashToken = async (token: string) => {
  const hashed = await bcrypt.hash(token, 12);
  return hashed;
};
