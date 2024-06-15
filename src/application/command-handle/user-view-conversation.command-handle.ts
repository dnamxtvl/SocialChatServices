import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { UserViewConversationCommand } from "../command/user-view-conversation.command";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";

@CommandHandler(UserViewConversationCommand)
export class UserViewConversationCommandHandle implements ICommandHandler<UserViewConversationCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async execute(command: UserViewConversationCommand) {
    const authUser = command.mappingUserEntityToModel();
    const conversation = await this.conversationRepository.findById(command.conversationId);
    if (!conversation) throw new ApplicationError(
        'Không tồn tại cuộc trò chuyện!',
        HttpStatus.NOT_FOUND,
        EXCEPTION_CODE_APPLICATION.CONVERSATION_NOT_FOUND_WHEN_VIEW_CONVERSATION
    );

    authUser.checkIsSameOrganizationWithUser(conversation.getOrganizationId());
    const userOfConversation = await this.userConversationRepository.findByUserIdAndConversationId(authUser.getId(), command.conversationId);

    if (!userOfConversation) throw new ApplicationError(
        'Bạn đã bị xóa khỏi cuộc trò chyện này!',
        HttpStatus.FORBIDDEN,
        EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_VIEW_CONVERSATION
    );

    if (conversation.getType() == TypeConversationEnum.SINGLE) {
      // get user partner
      // check user partner is active
      // check user partner is not block
    }

    
  }
}