import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { UserRepository } from "src/infrastructure/repository/user.repository";

export const UserRepositoryProvider = {
    provide: IUserRepository,
    useClass: UserRepository,
};