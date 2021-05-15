import { getConnection } from 'typeorm';
import { UserToken } from '../../entity/UserToken';

export const deleteRefreshToken = async (none: string) => {
  const tokenRepository = getConnection().getRepository(UserToken);
  const deletedResult = await tokenRepository.delete({
    none,
  });
  if (!deletedResult) return null;
  return deletedResult;
};
