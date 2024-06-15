import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { UserModel } from "src/domain/chat/models/user/user.model";

export interface MessageDetailDto {
    message: MessageModel,
    userSend: UserModel,
    conversation: ConversationModel,
    userPartnerActive?: boolean,
    userPartnerBlocked?: boolean
}