import { MessageModel } from '../models/message/message.model';
import { BaseRepository } from './base';
import { ClientSession } from 'mongoose';

export abstract class IMessageRepository extends BaseRepository {
  findById: (id: string) => Promise<MessageModel | null>;

  isFirstOfAvgTime: (conversationId: string) => Promise<boolean>;

  saveMessage: (model: MessageModel, session: ClientSession) => Promise<MessageModel>;

  insertManyMessages: (models: MessageModel[], session: ClientSession) => Promise<MessageModel[]>;
}