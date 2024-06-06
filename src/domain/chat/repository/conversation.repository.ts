import { ConversationModel } from '../models/conversation/conversation.model';
import { BaseRepository } from './base';
import { ClientSession } from 'mongoose';

export abstract class IConversationRepository extends BaseRepository {
  findById: (id: string) => Promise<ConversationModel | null>;

  findByUserCreatedBy: (userId: string) => Promise<ConversationModel[] | null>;

  saveConversation: (model: ConversationModel, session: ClientSession) => Promise<ConversationModel>;
}