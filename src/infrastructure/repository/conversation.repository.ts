import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, now } from 'mongoose';
import { Conversation } from '../entities/conversation.entity';
import { IConversationRepository } from 'src/domain/chat/repository/conversation.repository';
import { ConversationModel } from 'src/domain/chat/models/conversation/conversation.model';
import { APPLICATION_CONST } from 'src/const/application';


@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(@InjectModel('Conversation') private readonly conversation: Model<Conversation>) {}
  
  async findById(id: string): Promise<ConversationModel | null> {
    const conversation = await this.conversation.findById({
      _id: id
    }).exec();

    return conversation ? this.mappingConversationEntityToModel(conversation) : null;
  }

  async findByUserCreatedBy(userId: string): Promise<ConversationModel[] | null> {
    const conversations = await this.conversation
      .find({
        created_by: userId,
      })
      .exec();

    return conversations.length > 0
      ? conversations.map((conversation) =>
          this.mappingConversationEntityToModel(conversation),
        )
      : null;
  }

  async saveConversation(model: ConversationModel, session: ClientSession): Promise<ConversationModel> {
    const conversation = new this.conversation({
      name: model.getName(),
      created_by: model.getCreatedBy(),
      organization_id: model.getOrganizationId(),
      type: model.getType(),
      latest_active_at: model.getLatestActivity(),
      last_message: model.getLatestMessageId(),
      avatar: model.getAvatar(),
    });
    const newConervsation = await conversation.save({ session });

    return this.mappingConversationEntityToModel(newConervsation);
  }

  private mappingConversationEntityToModel(conversation: Conversation): ConversationModel {
    return new ConversationModel(
      conversation.name,
      conversation.created_by,
      conversation.organization_id,
      conversation.type,
      conversation.latest_active_at,
      conversation.last_message ? conversation.last_message._id.toString() : null,
      conversation._id.toString(),
      conversation.avatar,
      conversation.createdAt,
      conversation.updatedAt,
    );
  }
}
