import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";
import { SendMessageCommand } from "../command/send-message.command";
import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { EXCEPTION_CODE_APPLICATION } from "../enums/exception-code.enum";
import { IConversationRepository } from "src/domain/chat/repository/conversation.repository";
import { MessageModel } from "src/domain/chat/models/message/message.model";
import { TypeMessageEnum } from "src/const/enums/message/type";
import { IMessageRepository } from "src/domain/chat/repository/message.repository";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Message } from "src/infrastructure/entities/message.entity";
import { InjectModel } from "@nestjs/mongoose";
import { FileObject } from "src/@type/Message";

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandle implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    @InjectModel('Message') private readonly message: Model<Message>,
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

    if (command.replyMessageId.length > 0) {
      let replyMessage = await this.messageRepository.findById(command.replyMessageId);
      if (replyMessage === null) {
        throw new ApplicationError(
          'Không tìm thấy tin nhán reply!',
          HttpStatus.NOT_FOUND,
          EXCEPTION_CODE_APPLICATION.MESSAGE__REPLY_NOT_FOUND_WHEN_SEND_MESSAGE
        );
      }
    }

    let latestMessage = null;
    let firstOfAvgTime = await this.messageRepository.isFirstOfAvgTime(command.conversationId);
    const session = await this.connection.startSession();
    session.startTransaction();
    //await this.message.deleteMany({ type: { $in: [1, 2, 4, 7] } });
    try {
      if (command.messageText.length > 0) {
        let message = new MessageModel(
          TypeMessageEnum.TEXT,
          command.conversationId,
          firstOfAvgTime,
          userSend.getId(),
          null,
          command.messageText,
          command.replyMessageId
        );
        let newMessage = await this.messageRepository.saveMessage(message, session);
        latestMessage = newMessage;
        firstOfAvgTime = false;
      }

      if (latestMessage !== null) {
        await this.conversationQueue.add('message_sent', {
          conversation: conversaion,
          userSend: userSend,
          latestMessage: latestMessage,
          messageUUId: command.messageUUId,
        });
      }

      if (command.files.length > 0) {
        const files = command.files.map((item: FileObject, index: number) => ({
          ...item,
          fileId: command.fileUUIds[index],
        }));

        this.conversationQueue.add('upload_file', {
          files: files,
          userId: command.user.id,
          replyMessageId: command.replyMessageId,
          firstOfAvgTime: firstOfAvgTime,
          conversation: conversaion,
          userSend: userSend,
        });
      }

      session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}