import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { VALIDATION } from "src/const/validation";
import { ExceptionCode } from "src/domain/chat/enums/exception-code";

export class SendMessageCommand {
    constructor(
      public readonly userId: string,
      public readonly conversationId: string,
      public readonly messageText?: string,
      public readonly replyMessageId?: string,
      public readonly files?: Express.Multer.File[]
    ) {
        this.validateMessageContent();
    }

    private validateMessageContent() {
        if (!this.messageText && this.files.length === 0) {
            throw new ApplicationError(
                'Bạn chưa nhập nội dung tin nhắn!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.MESSAGE_TEXT_IS_REQUIRED
            );
        }

        if (this.messageText.length > VALIDATION.MESSAGE.CONTENT.MAX_LENGTH) {
            throw new ApplicationError(
                'Tin nhắn không được vượt quá ' + VALIDATION.MESSAGE.CONTENT.MAX_LENGTH + ' ký tự!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.MESSAGE_TEXT_IS_TOO_LONG
            );
        }
    }
  }