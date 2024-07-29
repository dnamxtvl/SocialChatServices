import { UserConversationModel } from '../models/conversation/user-conversation.model';
import { ClientSession } from 'mongoose';

export abstract class IUserConversationRepository {
  findByUserId: (userId: string) => Promise<UserConversationModel[] | null>;

  findByUserIdAndName: (
    userId: string,
    name: string,
  ) => Promise<UserConversationModel | null>;

  findByConversationId: (conversationId: string) => Promise<UserConversationModel[] | []>;

  findByUserIdAndConversationId: (
    userId: string,
    conversationId: string,
  ) => Promise<UserConversationModel | null>;

  saveUserConversation: (
    model: UserConversationModel,
  ) => Promise<UserConversationModel>;

  insertUserConversation: (
    models: UserConversationModel[],
    session: ClientSession,
  ) => Promise<void>;

  listUserConversationPaginate: (
    userId: string,
    skip: number
  ) => Promise<UserConversationModel[] | []>;

  bulkWriteUpsert : (
    models: UserConversationModel[], userSend: any, latestMessageId: string
  ) => Promise<void>;
}