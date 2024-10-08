import { Injectable } from '@nestjs/common';
import { Message, StatusMessageEnum } from '../entities/message.entity';
import { IMessageRepository } from 'src/domain/chat/repository/message.repository';
import { MessageModel } from 'src/domain/chat/models/message/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { APPLICATION_CONST } from 'src/const/application';
import { BaseRepository } from './base';
import { TypeMessageEnum } from 'src/const/enums/message/type';


@Injectable()
export class MessageRepository extends BaseRepository implements IMessageRepository {
  constructor(@InjectModel('Message') private readonly message: Model<Message>) {
    super();
  }
  
  async findById(id: string): Promise<MessageModel | null> {
    const message = await this.message
      .findById({
        _id: id,
      })
      .exec();

    return message ? this.mappingMessageEntityToModel(message) : null
  }

  async isFirstOfAvgTime(conversationId: string): Promise<boolean> {
    const messages = await this.message
      .findOne({
        conversation: conversationId,
        created_at: {
          $gt: new Date((new Date()).getTime() - APPLICATION_CONST.MESSAGE.TIME_FIRST_OF_AVG)
        }
      })
      .exec();

    return messages ? false : true;
  }

  async saveMessage(model: MessageModel, session?: ClientSession): Promise<MessageModel> {
    const message = new this.message({
      type: model.getType(),
      conversation: model.getConversationId(),
      created_at: model.getCreatedAt(),
      first_of_avg_time: model.getFirstOfAvgTime(),
      content: model.getContent(),
      user_send_id: model.getUserSendId(),
      parent_id: model.getParentId(),
      status: StatusMessageEnum.SENT,
    });
    const newMessage = session ? await message.save({ session }) : await message.save();

    return this.mappingMessageEntityToModel(newMessage);
  }

  async insertManyMessages(models: MessageModel[], session: ClientSession): Promise<MessageModel[]> {
    const messages = models.map((model) => {
      return {
        type: model.getType(),
        conversation: model.getConversationId(),
        created_at: model.getCreatedAt(),
        first_of_avg_time: model.getFirstOfAvgTime(),
        content: model.getContent(),
        user_send_id: model.getUserSendId(),
        parent_id: model.getParentId(),
        status: StatusMessageEnum.SENT
      }
    });
    const newMessage = await this.message.insertMany(messages, { session });

    return newMessage.map((message) => this.mappingMessageEntityToModel(message));
  }

  async listMessagePaginate(conversationId: string, skip: number): Promise<MessageModel[] | null> {
    const messages = await this.message
      .find({
        conversation: conversationId,
        type: {$nin: [TypeMessageEnum.NOTIFY, TypeMessageEnum.EMOJI]}
      })
      .skip(skip)
      .limit(APPLICATION_CONST.MESSAGE.LIMIT_PAGINATE)
      .sort({ _id: -1 })
      .exec();

    return messages ? messages.map((message) => this.mappingMessageEntityToModel(message)) : null;
  }
}
