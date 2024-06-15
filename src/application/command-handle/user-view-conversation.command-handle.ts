import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { UserViewConversationCommand } from "../command/user-view-conversation.command";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";
import { VALIDATION } from "src/const/validation";
import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { IUserBlockRepository } from "src/domain/chat/repository/user-block.repository";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { now } from "mongoose";
import { MessageDetail } from "src/@type/Message";

@CommandHandler(UserViewConversationCommand)
export class UserViewConversationCommandHandle implements ICommandHandler<UserViewConversationCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly userRepository: IUserRepository,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(command: UserViewConversationCommand): Promise<MessageDetail[]> {
    const authUser = command.mappingUserEntityToModel();
    const conversation = await this.conversationRepository.findById(command.conversationId);
    if (!conversation) throw new ApplicationError(
        'Không tồn tại cuộc trò chuyện!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.CONVERSATION_NOT_FOUND_WHEN_VIEW_CONVERSATION
    );

    authUser.checkIsSameOrganizationWithUser(conversation.getOrganizationId());
    const userOfConversation = await this.userConversationRepository.findByConversationId(command.conversationId);

    if (userOfConversation.length == 0) {
      throw new ApplicationError(
        'Cuộc trò chuyện không hợp lệ!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_VIEW_CONVERSATION,
      );
    }

    let authUserConversation = userOfConversation.filter((user) => user.getUserId() == authUser.getId())
    if (authUserConversation.length == 0) {
      throw new ApplicationError(
        'Bạn đã bị xóa khỏi cuộc trò chuyện!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_VIEW_CONVERSATION
      );
    }

    let userPartnerActive = true;
    let userPartnerBlocked = false;

    if (conversation.getType() == TypeConversationEnum.SINGLE) {
      if (userOfConversation.length != VALIDATION.CONVERSATION.MIN_MEMBER) {
        throw new ApplicationError(
          'Cuộc trò chuyện không hợp lệ!',
          HttpStatus.NOT_FOUND,
          EXCEPTION_CODE_APPLICATION.INVALID_TYPE_CONVERSATION
        )
      }

      const userPartner = userOfConversation.filter((user) => user.getUserId() != authUser.getId())[0];
      userPartnerActive = await this.userRepository.findUserActive(userPartner.getUserId()) ? true : false;
      userPartnerBlocked = await this.userBlockRepository.isUserBlocked(authUser, userPartner.getUserId());
    }

    let authUserConversationUpdate = authUserConversation[0];
    authUserConversationUpdate.setLatestConversationUserViewAt(now());
    await this.userConversationRepository.saveUserConversation(authUserConversationUpdate);

    const listMessage = await this.messageRepository.listMessagePaginate(command.conversationId, command.page);
    const listUserSendMessage = await this.userRepository.findByManyIds(listMessage.map((message) => message.getUserSendId()));

    return listMessage.map((message) => {
      let userSend = listUserSendMessage.filter((user) => user.getId() == message.getUserSendId())[0];
      return conversation.getType() == TypeConversationEnum.GROUP
        ? {
            message: message,
            profile: {
              id: userSend.getId(),
              first_name: userSend.getFirstName(),
              last_name: userSend.getLastName(),
              avatar: userSend.getAvatar(),
            },
            conversation: conversation,
          }
        : {
            message: message,
            profile: {
              id: userSend.getId(),
              first_name: userSend.getFirstName(),
              last_name: userSend.getLastName(),
              avatar: userSend.getAvatar(),
            },
            conversation: conversation,
            userPartnerActive: userPartnerActive,
            userPartnerBlocked: userPartnerBlocked,
          };
    });
  }
}