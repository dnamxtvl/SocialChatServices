import { UserModel } from '../models/user/user.model';

export abstract class IUserRepository {
  findById: (id: string) => Promise<UserModel | null>;

  findByManyIds: (ids: string[]) => Promise<UserModel[] | null>;

  findUserActive: (userId: string) => Promise<UserModel | null>;
}