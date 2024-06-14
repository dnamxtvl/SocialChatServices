import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateConversationCommand } from "../command/create-conversation.command";
import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { ApplicationError } from "../exceptions";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { HttpStatus } from "@nestjs/common";
import { ConversationModel } from "src/domain/chat/models/conversation/conversation.model";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { TypeMessageEnum } from "src/infrastructure/entities/message.entity";
import { now } from "mongoose";
import { UserConversationModel } from "src/domain/chat/models/conversation/user-conversation.model";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { VALIDATION } from "src/const/validation";

@CommandHandler(CreateConversationCommand)
export class CreateConversationCommandHandle implements ICommandHandler<CreateConversationCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly messageRepository: IMessageRepository,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async execute(command: CreateConversationCommand) {
    let listUserId = Array.from(new Set(command.listUserId));
    if (listUserId.length < VALIDATION.CONVERSATION.MIN_MEMBER) throw new ApplicationError(
      'Danh sách phải có ít nhất 2 user!',
      HttpStatus.BAD_REQUEST,
      EXCEPTION_CODE_APPLICATION.LIST_USER_CONVERSATION_LESS_THAN_TWO
    );
  
    const users = await this.userRepository.findByManyIds(listUserId);
    if (users === null) throw new ApplicationError(
      'Không tìm thấy user nào!',
      HttpStatus.NOT_FOUND,
      EXCEPTION_CODE_APPLICATION.USER_NOT_FOUND_WHEN_FIND_MANY
    );

    if (users.length !== listUserId.length) throw new ApplicationError(
      'Không tìm thấy user!',
      HttpStatus.NOT_FOUND,
      EXCEPTION_CODE_APPLICATION.LIST_USER_NOT_FOUND
    );

    for (const user of users) {
      user.checkIsSameOrganizationWithUser(command.authUser.organization_id);
    }

    if (!listUserId.includes(command.authUser.id)) listUserId.push(command.authUser.id);
    let conversation = new ConversationModel(
      command.conversationName,
      command.authUser.id,
      command.authUser.organization_id,
      TypeConversationEnum.GROUP,
      new Date(),
      listUserId.length,
      null,
      null,
      command.avatar,
      new Date(),
      new Date(),
    );

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      let newConversation = await this.conversationRepository.saveConversation(conversation, session);
      let firstMessage = new MessageModel(
        TypeMessageEnum.NOTIFY, newConversation.getId(), false, command.authUser.id, null, 'Nhóm mới!', null, null
      );
      let firstMessageConversation = await this.messageRepository.saveMessage(firstMessage, session);
      let conversations = listUserId.map((userId) => {
        return new UserConversationModel(
          userId, newConversation.getId(), firstMessageConversation.getId(), now(), 0, false, null
        );
      })
      await this.userConversationRepository.insertUserConversation(conversations, session);
      session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}