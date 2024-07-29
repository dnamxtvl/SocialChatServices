import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { UserViewConversationCommand } from "../command/user-view-conversation.command";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";
import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { IUserBlockRepository } from "src/domain/chat/repository/user-block.repository";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { now } from "mongoose";
import { UserConversationModel } from "src/domain/chat/models/conversation/user-conversation.model";
import { ResultUserViewConversation } from "src/@type/Message";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { UserModel } from "src/domain/chat/models/user/user.model";

@CommandHandler(UserViewConversationCommand)
export class UserViewConversationCommandHandle implements ICommandHandler<UserViewConversationCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly userRepository: IUserRepository,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(command: UserViewConversationCommand): Promise<ResultUserViewConversation> {
    const authUser = command.mappingUserEntityToModel();
    const conversation = await this.conversationRepository.findById(command.conversationId);
    if (!conversation) throw new ApplicationError(
        'Không tồn tại cuộc trò chuyện!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.CONVERSATION_NOT_FOUND_WHEN_VIEW_CONVERSATION
    );

    authUser.checkIsSameOrganizationWithUser(conversation.getOrganizationId());
    const userOfConversation = await this.userConversationRepository.findByConversationId(command.conversationId);
    let authUserConversation = userOfConversation.length ? userOfConversation.find((user: UserConversationModel) => user.getUserId() == authUser.getId()) : null;

    if (!authUserConversation) {
      throw new ApplicationError(
        'Bạn đã bị xóa khỏi cuộc trò chuyện!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_VIEW_CONVERSATION
      );
    }

    let userPartnerActive = true;
    let userPartnerBlocked = false;

    if (conversation.getType() == TypeConversationEnum.SINGLE) {
      conversation.checkIsValidMemberOfSingleConversation(userOfConversation);
      const userPartner = userOfConversation.find((user: UserConversationModel) => user.getUserId() != authUser.getId());
      userPartnerActive = await this.userRepository.findUserActive(userPartner.getUserId()) ? true : false;
      userPartnerBlocked = await this.userBlockRepository.isUserBlocked(authUser, userPartner.getUserId());
    }

    authUserConversation.setLatestConversationUserViewAt(now());
    authUserConversation.readConversation();
    await this.userConversationRepository.saveUserConversation(authUserConversation);

    const listMessage = await this.messageRepository.listMessagePaginate(command.conversationId, command.skip);
    const listUserSendMessage = await this.userRepository.findByManyIds(userOfConversation.map((user: UserConversationModel) => user.getUserId()));
    const listMessageAfterMapping = listMessage.map((message: MessageModel) => {
      let userSend = listUserSendMessage.find((user: UserModel) => user.getId() == message.getUserSendId());
      let profile = {
        id: userSend.getId(),
        firstName: userSend.getFirstName(),
        lastName: userSend.getLastName(),
        avatar: userSend.getAvatar(),
      }

      return conversation.getType() == TypeConversationEnum.GROUP
        ? { message: message, profile: profile }
        : {
            message: message,
            profile: profile,
            userPartnerActive: userPartnerActive,
            userPartnerBlocked: userPartnerBlocked,
          };
    });

    return {
      conversation: {
        info: conversation,
        listUser: listUserSendMessage,
      },
      listMessage: listMessageAfterMapping,
    }
  }
}