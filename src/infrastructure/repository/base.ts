import { Conversation } from "src/infrastructure/entities/conversation.entity";
import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { Message } from "../entities/message.entity";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { UserSendVO } from 'src/domain/chat/value-objects/user-send.vo';
import { EmailVO } from 'src/domain/chat/value-objects/email.vo';
import { UserConversation } from "../entities/user-conversation.entity";
import { UserConversationModel } from "src/domain/chat/models/conversation/user-conversation.model";
import { Types } from "mongoose";
let moment = require('moment-timezone')

export class BaseRepository {
    protected mappingConversationEntityToModel(conversation: Conversation): ConversationModel {
        return new ConversationModel(
            conversation.name,
            conversation.created_by,
            conversation.organization_id,
            conversation.type,
            conversation.latest_active_at,
            conversation.count_member,
            conversation.last_message ? conversation.last_message._id.toString() : null,
            conversation._id.toString(),
            conversation.avatar,
            moment.tz(conversation.created_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss"),
            moment.tz(conversation.updated_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss")
        );
    }

    protected mappingMessageEntityToModel(message: Message): MessageModel {
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
          moment.tz(message.created_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss"),
        )
    }

    protected mappingUserConversationEntityToModel(userConversation: UserConversation): UserConversationModel {
        return new UserConversationModel(
          userConversation.user_id,
          userConversation.conversation._id.toString(),
          userConversation.last_message._id.toString(),
          moment.tz(userConversation.latest_active_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss"),
          userConversation.no_unread_message,
          userConversation.disabled_notify,
          userConversation.expired_disabled_notify_at ? moment.tz(userConversation.expired_disabled_notify_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss") : null,
          userConversation.created_at,
          moment.tz(userConversation.updated_at, 'Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss"),
          userConversation._id.toString(),
          userConversation.last_message instanceof Types.ObjectId ? null : this.mappingMessageEntityToModel(userConversation.last_message),
          userConversation.latest_user_send ? new UserSendVO(
            userConversation.latest_user_send.id,
            userConversation.latest_user_send.first_name,
            userConversation.latest_user_send.last_name,
            new EmailVO(userConversation.latest_user_send.email),
            userConversation.latest_user_send.avatar,
          ) : null,
          userConversation.conversation.created_at ? this.mappingConversationEntityToModel(userConversation.conversation) : null,
        );
      }
}
