import { UserModel } from '../models/user/user.model';
import { BaseRepository } from './base';

export abstract class IUserRepository extends BaseRepository {
  findById: (id: string) => Promise<UserModel | null>;

  findByManyIds: (ids: string[]) => Promise<UserModel[] | null>;
}