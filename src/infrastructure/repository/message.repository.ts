import { Injectable } from '@nestjs/common';
import { Message, StatusMessageEnum } from '../entities/message.entity';
import { IMessageRepository } from 'src/domain/chat/repository/message.repository';
import { MessageModel } from 'src/domain/chat/models/message/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { APPLICATION_CONST } from 'src/const/application';


@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(@InjectModel('Message') private readonly message: Model<Message>) {}
  
  async findById(id: string): Promise<MessageModel | null> {
    const message = await this.message
      .findById({
        id: id,
      })
      .exec();

    return message ? this.mappingMessageEntityToModel(message) : null
  }

  async isFirstOfAvgTime(conversationId: string): Promise<boolean> {
    const messages = await this.message
      .findOne({
        conversation: conversationId,
        createdAt: {
          $gt: new Date((new Date()).getTime() - APPLICATION_CONST.MESSAGE.TIME_FIRST_OF_AVG)
        }
      })
      .exec();

    return messages ? false : true;
  }

  async saveMessage(model: MessageModel, session: ClientSession): Promise<MessageModel> {
    const message = new this.message({
      type: model.getType(),
      conversation: model.getConversationId(),
      created_at: model.getCreatedAt(),
      first_of_avg_time: model.getFirstOfAvgTime(),
      content: model.getContent(),
      user_send_id: model.getUserSendId(),
      parent_id: model.getParentId(),
    });
    const newMessage = await message.save({ session });

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
        status: StatusMessageEnum.UNREAD
      }
    });
    const newMessage = await this.message.insertMany(messages, { session });

    return newMessage.map((message) => this.mappingMessageEntityToModel(message));
  }

  private mappingMessageEntityToModel(message: Message): MessageModel {
    return new MessageModel(
      message.type,
      message.conversation._id.toString(),
      message.first_of_avg_time,
      message.user_send_id,
      message._id.toString(),
      message.content,
      message.latest_user_seen_id,
      message.parent_id ? message.parent_id.toString() : null,
      message.device_id,
      message.ip_send,
      message.createdAt,
    )
  }
}
