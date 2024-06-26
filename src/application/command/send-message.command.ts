import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { AuthUser } from "src/@type/User";
import { VALIDATION } from "src/const/validation";
import { ExceptionCode } from "src/domain/chat/enums/exception-code";
import { UserModel } from "src/domain/chat/models/user/user.model";
import { EmailVO } from "src/domain/chat/value-objects/email.vo";
import { UserStatusActiveEnum } from "src/const/enums/user/status-active";

export class SendMessageCommand {
    constructor(
      public readonly user: AuthUser,
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

    public mappingUserEntityToModel(): UserModel {
        return new UserModel(
          this.user.id,
          this.user.first_name,
          this.user.last_name,
          new EmailVO(this.user.email),
          this.user.organization_id,
          this.user.type_account,
          this.user.phone_number,
          this.user.avatar,
          this.user.gender,
          this.user.unit_room_id,
          this.user.last_activity_at,
          this.user.status_active == UserStatusActiveEnum.ONLINE,
          this.user.created_at
        )
    }
  }