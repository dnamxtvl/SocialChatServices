import { BaseRepository } from './base';
import { UserConversationModel } from '../models/conversation/user-conversation.model';
import { ClientSession } from 'mongoose';

export abstract class IUserConversationRepository extends BaseRepository {
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
    page: number
  ) => Promise<UserConversationModel[] | null>;

  bulkWriteUpsert : (
    models: UserConversationModel[], userSendId: string, latestMessageId: string
  ) => Promise<void>;
}