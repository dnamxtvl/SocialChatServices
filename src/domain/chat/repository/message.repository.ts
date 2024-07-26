import { MessageModel } from '../models/message/message.model';
import { ClientSession } from 'mongoose';

export abstract class IMessageRepository {
  findById: (id: string) => Promise<MessageModel | null>;

  isFirstOfAvgTime: (conversationId: string) => Promise<boolean>;

  saveMessage: (model: MessageModel, session?: ClientSession) => Promise<MessageModel>;

  insertManyMessages: (models: MessageModel[], session: ClientSession) => Promise<MessageModel[]>;

  listMessagePaginate: (conversationId: string, page: number) => Promise<MessageModel[] | null>;
}