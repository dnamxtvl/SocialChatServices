import { UserBlockModel } from "../models/user/user-block.model";
import { UserModel } from "../models/user/user.model";

export abstract class IUserBlockRepository {
  findByUserId: (userId: string) => Promise<UserBlockModel[] | null>;

  isUserBlocked: (user: UserModel, blockedUserId: string) => Promise<boolean>;
}