import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserModel } from 'src/domain/chat/models/user/user.model';
import { EmailVO } from 'src/domain/chat/value-objects/email.vo';
import { UserStatusActiveEnum } from 'src/const/enums/user/status-active';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from 'src/domain/chat/repository/message.repository';
import { MessageModel } from 'src/domain/chat/models/message/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSendVO } from 'src/domain/chat/value-objects/user-send.vo';


@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(@InjectModel('Message') private readonly message: Model<Message>) {}
  
  async findById(id: string): Promise<MessageModel | null> {
    const message = await this.message.findById({
      id: id
    }).exec();

    return message ? new MessageModel(
        message.type,
        message.conversation_id,
        message.created_at,
        message.first_of_avg_time,
        message.id,
        message.content,
        new UserSendVO(
          message.user_send.id,
          message.user_send.first_name,
          message.user_send.last_name,
          new EmailVO(message.user_send.email),
          message.user_send.organization_name,
          message.user_send.avatar,
          message.user_send.unit_room_name
        ),
        null, 
    ) : null
  }
}
