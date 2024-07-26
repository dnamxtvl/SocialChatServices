import { UnitRoom } from "./Organization";
import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { UserModel } from "src/domain/chat/models/user/user.model";
import { Url } from "url";

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

export interface FileObject {
  name: String,
  buffer: any,
  mimetype: String,
  fileId?: string,
  size: number
}

export interface FileContent {
  name: String,
  path: String,
  mimeType: String,
  size: number,
  fileId?: string,
}