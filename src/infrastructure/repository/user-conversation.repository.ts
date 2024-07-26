import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { IUserConversationRepository } from 'src/domain/chat/repository/user-conversation.repository';
import { UserConversation } from '../entities/user-conversation.entity';
import { UserConversationModel } from 'src/domain/chat/models/conversation/user-conversation.model';
import { APPLICATION_CONST } from 'src/const/application';
import { BaseRepository } from './base';
import { Types } from 'mongoose';

@Injectable()
export class UserConversationRepository extends BaseRepository implements IUserConversationRepository {
  constructor(@InjectModel('UserConversation') private readonly userConversation: Model<UserConversation>) {
    super();
  }

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

  async findByConversationId(conversationId: string): Promise<UserConversationModel[] | []> {
    const userConversations = await this.userConversation
      .find({
        conversation: conversationId,
      })
      .exec();

    return userConversations.length > 0
      ? userConversations.map((conversation) =>
          this.mappingUserConversationEntityToModel(conversation),
        )
      : [];
  }

  async findByUserIdAndConversationId(userId: string, conversationId: string): Promise<UserConversationModel | null> {
    const userConversation = await this.userConversation
      .findOne({
        conversation: conversationId,
        user_id: userId,
      })
      .exec();

    return userConversation ? this.mappingUserConversationEntityToModel(userConversation) : null;
  }

  async saveUserConversation(model: UserConversationModel): Promise<UserConversationModel> {
    const userConversationData = {
      user_id: model.getUserId(),
      conversation: model.getConversationId(),
      last_message: model.getLatestMessageId(),
      latest_active_at: model.getLatestActivity(),
      no_unread_message: model.getNoUnredMessage(),
      disabled_notify: model.getDisabledNotify(),
      expired_disabled_notify_at: model.getExpiredDisabledNotifyAt(),
      last_user_view_conversation_at: model.getLatestConversationUserViewAt(),
    };

    let newUserConversation;
    if (!model.getId()) {
      const userConversation = new this.userConversation(userConversationData);
      newUserConversation = await userConversation.save();
    } else {
      const filter = { _id: model.getId() };
      const update = { $set: userConversationData };
      newUserConversation = await this.userConversation.findOneAndUpdate(filter, update, { new: true }).exec();
    }

    return this.mappingUserConversationEntityToModel(newUserConversation);
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
    }));

    await this.userConversation.insertMany(userConversations, { session });
  }

  async listUserConversationPaginate(userId: string, page: number): Promise<UserConversationModel[] | []> {
    const userConversations = await this.userConversation
      .find({
        user_id: userId
      })
      .populate(['last_message', 'conversation'])
      .sort({ latest_active_at: -1 })
      .skip((page - 1) * APPLICATION_CONST.CONVERSATION.LIMIT_PAGINATE)
      .limit(APPLICATION_CONST.CONVERSATION.LIMIT_PAGINATE)
      .exec();

    return userConversations.length > 0
      ? userConversations.map((conversation) =>
          this.mappingUserConversationEntityToModel(conversation),
        )
      : [];
  }

  async bulkWriteUpsert(userConversations: UserConversationModel[], userSend: any, latestMessageId: string): Promise<void> {
    const userConversationsEntity = userConversations.map((model) => ({
      _id: new Types.ObjectId(model.getId()),
      user_id: model.getUserId(),
      conversation: model.getConversationId(),
      last_message: latestMessageId,
      latest_active_at: new Date(),
      no_unread_message: model.getNoUnredMessage() + 1,
      disabled_notify: model.getDisabledNotify(),
      expired_disabled_notify_at: model.getExpiredDisabledNotifyAt(),
      latest_user_send: {
        id: userSend.id,
        first_name: userSend.firstName,
        last_name: userSend.lastName,
        email: userSend.email.value,
        avatar: userSend.avatar,
      },
    }));

    const bulkOps = userConversationsEntity.map((model) => ({
      updateOne: {
        filter: { _id: model._id },
        update: { $set: model },
        upsert: true,
      },
    }));

    await this.userConversation.bulkWrite(bulkOps);
  }
}
