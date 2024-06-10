import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { SendMessageCommand } from "../command/send-message.command";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { IUserRepository } from "src/domain/chat/repository/user.repository";
import { addTypeMessageForFiles } from "src/helpers/message.helper";
import { UserConversationModel } from "src/domain/chat/models/conversation/user-conversation.model";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { TypeMessageEnum } from "src/const/enums/message/type";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandle implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SendMessageCommand) {
    const userSend = await this.userRepository.findById(command.userId);
    if (userSend === null) {
        throw new ApplicationError(
            'User với id ' + command.userId + ' kh không tồn tại!',
            HttpStatus.NOT_FOUND,
            EXCEPTION_CODE_APPLICATION.USER_NOT_FOUND_WHEN_SEND_MESSAGE
        );
    }

    let conversaion = await this.conversationRepository.findById(command.conversationId);
    if (conversaion === null) {
        throw new ApplicationError(
            'Không tồn tại cuộc trò chuyện!',
            HttpStatus.NOT_FOUND,
            EXCEPTION_CODE_APPLICATION.CONVERSATION_NOT_FOUND_WHEN_SEND_MESSAGE
        );
    }

    if (conversaion.getOrganizationId() !== userSend.getOrganizationId()) {
        throw new ApplicationError(
            'User với id ' + userSend.getId() + ' không thuộc đơn vị này!',
            HttpStatus.BAD_REQUEST,
            EXCEPTION_CODE_APPLICATION.USER_NOT_IN_ORGANIZATION
        );
    }

    const userOfConversation = await this.userConversationRepository.findByConversationId(command.conversationId);
    if (userOfConversation.length === 0 || userOfConversation.map((user: UserConversationModel) => user.getUserId()).indexOf(command.userId) === -1) {
        throw new ApplicationError(
            'User với id ' + userSend.getId() + ' không thuộc cuộc trò chuyện!',
            HttpStatus.BAD_REQUEST,
            EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_SEND_MESSAGE
        );
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
        if (command.messageText.length > 0) {
            let message = new MessageModel(
                TypeMessageEnum.TEXT,
                command.conversationId,
                await this.messageRepository.isFirstOfAvgTime(command.conversationId),
                command.userId,
                null,
                command.messageText,
                command.replyMessageId.length > 0 ? command.replyMessageId : null
            );
            await this.messageRepository.saveMessage(message, session);
        }

        let files = command.files && command.files.length > 0 ? addTypeMessageForFiles(command.files) : [];
        if (files.length > 0) {
            let messages = files.map(async (file) => {
                return new MessageModel(
                    file.type,
                    command.conversationId,
                    await this.messageRepository.isFirstOfAvgTime(command.conversationId),
                    command.userId,
                    null,
                    file.path,
                    command.replyMessageId.length > 0 ? command.replyMessageId : null
                );
            });
            await this.messageRepository.insertManyMessages(await Promise.all(messages), session);
        }

        session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
  }
}