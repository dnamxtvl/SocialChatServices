import { MessageModel } from '../models/message/message.model';
import { BaseRepository } from './base';

export abstract class IMessageRepository extends BaseRepository {
  findById: (
    id: string,
  ) => Promise<MessageModel | null>;
}