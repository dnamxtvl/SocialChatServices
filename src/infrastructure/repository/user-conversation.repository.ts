import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, now } from 'mongoose';
import { IUserConversationRepository } from 'src/domain/chat/repository/user-conversation.repository';
import { UserConversation } from '../entities/user-conversation.entity';
import { UserConversationModel } from 'src/domain/chat/models/conversation/user-conversation.model';


@Injectable()
export class UserConversationRepository implements IUserConversationRepository {
  constructor(@InjectModel('UserConversation') private readonly userConversation: Model<UserConversation>) {}

  async findByUserId(userId: string): Promise<UserConversationModel[] | null> {
    const userConversations = await this.userConversation
      .find({
        user_id: userId,
      })
      .exec();

    return userConversations.length > 0
      ? userConversations.map((conversation) =>
          this.mappingUserConversationEntityToModel(conversation),
        )
      : null;
  }

  async findByUserIdAndName(userId: string, name: string): Promise<UserConversationModel | null> {
    const userConversation = await this.userConversation
      .findOne({
        'conversation.name': name,
        user_id: userId,
      })
      .exec();

    return userConversation ? this.mappingUserConversationEntityToModel(userConversation) : null;
  }

  async saveUserConversation(model: UserConversationModel): Promise<UserConversationModel> {
    const userConversation = new this.userConversation({
      user_id: model.getUserId(),
      conversation: model.getConversationId(),
      last_message: model.getLatestMessageId(),
      latest_active_at: model.getLatestActivity(),
      no_unread_message: model.getNoUnredMessage(),
      disabled_notify: model.getDisabledNotify(),
      expired_disabled_notify_at: model.getExpiredDisabledNotifyAt(),
      created_at: model.getCreatedAt(),
      updated_at: model.getUpdatedAt(),
      deleted_at: null
    });
    const newUserConervsation = await userConversation.save();

    return this.mappingUserConversationEntityToModel(newUserConervsation);
  }

  async insertUserConversation(models: UserConversationModel[], session: ClientSession): Promise<void> {
    const userConversations = models.map((model) => ({
      user_id: model.getUserId(),
      conversation: model.getConversationId(),
      last_message: model.getLatestMessageId(),
      latest_active_at: model.getLatestActivity(),
      no_unread_message: model.getNoUnredMessage(),
      disabled_notify: model.getDisabledNotify(),
      expired_disabled_notify_at: model.getExpiredDisabledNotifyAt(),
      created_at: now(),
      updated_at: now(),
      deleted_at: null
    }));

    await this.userConversation.insertMany(userConversations, { session });
  }

  private mappingUserConversationEntityToModel(userConversation: UserConversation): UserConversationModel {
    return new UserConversationModel(
      userConversation.user_id,
      userConversation.conversation._id.toString(),
      userConversation.last_message._id.toString(),
      userConversation.latest_active_at,
      userConversation.no_unread_message,
      userConversation.disabled_notify,
      userConversation.expired_disabled_notify_at,
      userConversation.created_at,
      userConversation.updated_at,
      userConversation._id.toString()
    );
  }
}
