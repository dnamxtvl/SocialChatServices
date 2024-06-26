import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { SendMessageCommand } from "../command/send-message.command";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { addTypeMessageForFiles } from "src/helpers/message.helper";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { TypeMessageEnum } from "src/const/enums/message/type";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandle implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    @InjectConnection() private readonly connection: Connection,
    @InjectQueue('conversation') private conversationQueue: Queue
  ) {}

  async execute(command: SendMessageCommand): Promise<void> {
    const userSend = command.mappingUserEntityToModel();
    let conversaion = await this.conversationRepository.findById(command.conversationId);
    if (conversaion === null) {
        throw new ApplicationError(
            'Không tồn tại cuộc trò chuyện!',
            HttpStatus.NOT_FOUND,
            EXCEPTION_CODE_APPLICATION.CONVERSATION_NOT_FOUND_WHEN_SEND_MESSAGE
        );
    }
    conversaion.checkUserSendIsSameOrganizationWithConversation(userSend);
    const userOfConversation = await this.userConversationRepository.findByConversationId(command.conversationId);
    userSend.checkUserInConversation(userOfConversation);

    let files = command.files && command.files.length > 0 ? addTypeMessageForFiles(command.files) : [];
    let latestMessageId = null;
    let replyMessageId = command.replyMessageId.length > 0 ?
        (await this.messageRepository.findById(command.replyMessageId) ? command.replyMessageId : null) : null;
    let firstOfAvgTime = await this.messageRepository.isFirstOfAvgTime(command.conversationId);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
        if (command.messageText.length > 0) {
            let message = new MessageModel(
                TypeMessageEnum.TEXT,
                command.conversationId,
                firstOfAvgTime,
                userSend.getId(),
                null,
                command.messageText,
                replyMessageId
            );
            let newMessage = await this.messageRepository.saveMessage(message, session);
            latestMessageId = newMessage.getId();
            firstOfAvgTime = false;
        }

        if (files.length > 0) {
            let messages = files.map(async (file, index) => {
                return new MessageModel(
                    file.type,
                    command.conversationId,
                    index == 0 ? firstOfAvgTime : false,
                    userSend.getId(),
                    null,
                    file.path,
                    replyMessageId
                );
            });
            const newMessages = await this.messageRepository.insertManyMessages(await Promise.all(messages), session);
            latestMessageId = latestMessageId ?? newMessages.pop().getId();
        }

        if (latestMessageId === null) throw new ApplicationError(
            'Đã xảy ra lỗi!',
            HttpStatus.NOT_FOUND,
            EXCEPTION_CODE_APPLICATION.ERROR_UNKNOW_WHEN_SEND_MESSAGE
        )

        await this.conversationQueue.add('message_sent', {
          conversationId: command.conversationId,
          userSend: userSend,
          latestMessageId: latestMessageId.toString(),
        });

        session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
  }
}