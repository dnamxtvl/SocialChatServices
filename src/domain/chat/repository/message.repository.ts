import { MessageModel } from '../models/message/message.model';
import { BaseRepository } from './base';
import { ClientSession } from 'mongoose';

export abstract class IMessageRepository extends BaseRepository {
  findById: (id: string) => Promise<MessageModel | null>;

  saveMessage: (model: MessageModel, session: ClientSession) => Promise<MessageModel>;
}