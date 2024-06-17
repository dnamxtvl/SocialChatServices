import { UnitRoom } from "./Organization";
import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { UserConversationModel } from "src/domain/chat/models/conversation/user-conversation.model";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { UserModel } from "src/domain/chat/models/user/user.model";

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
    firstName: String;
    lastName: String;
    avatar: String | null;
  };
  userPartnerActive?: boolean;
  userPartnerBlocked?: boolean;
}

export interface ResultUserViewConversation {
  conversation: {
    info: ConversationModel;
    listUser: UserModel[];
  },
  listMessage: MessageDetail[];
}