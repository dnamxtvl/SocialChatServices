import { UnitRoom } from "./Organization";
import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { MessageModel } from "src/domain/chat/models/message/message.model";

export interface LatestMessageConversation {
    id: String,
    content: String,
    type: Number,
    user_send_id: String,
    conversation_id: String,
    createdAt: Date
}

export interface UserSend {
    id: String,
    name: String,
    avatar: String | null,
    unitRoom: UnitRoom
}

export interface MessageDetail {
  message: MessageModel;
  profile: {
    id: String;
    first_name: String;
    last_name: String;
    avatar: String | null;
  };
  conversation: ConversationModel;
  userPartnerActive?: boolean;
  userPartnerBlocked?: boolean;
}