import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { UserConversationRepository } from "src/infrastructure/repository/user-conversation.repository";
import { ConversationRepository } from "src/infrastructure/repository/conversation.repository";
import { MessageRepository } from "src/infrastructure/repository/message.repository";
import { UserRepository } from "src/infrastructure/repository/user.repository";

export const UserRepositoryProvider = {
    provide: IUserRepository,
    useClass: UserRepository,
};

export const MessageRepositoryProvider = {
    provide: IMessageRepository,
    useClass: MessageRepository,
}

export const ConversationRepositoryProvider = {
    provide: IConversationRepository,
    useClass: ConversationRepository,
}

export const UserConversationRepositoryProvider = {
    provide: IUserConversationRepository,
    useClass: UserConversationRepository
}