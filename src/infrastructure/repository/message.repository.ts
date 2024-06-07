import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from 'src/domain/chat/repository/message.repository';
import { MessageModel } from 'src/domain/chat/models/message/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';


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

  private mappingMessageEntityToModel(message: Message): MessageModel {
    return new MessageModel(
      message.type,
      message.conversation._id.toString(),
      message.createdAt,
      message.first_of_avg_time,
      message.user_send_id,
      message._id.toString(),
      message.content,
      message.latest_user_seen_id,
    )
  }
}
