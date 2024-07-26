import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { AuthUser } from "src/@type/User";
import { VALIDATION } from "src/const/validation";
import { ExceptionCode } from "src/domain/chat/enums/exception-code";
import { UserModel } from "src/domain/chat/models/user/user.model";
import { EmailVO } from "src/domain/chat/value-objects/email.vo";
import { UserStatusActiveEnum } from "src/const/enums/user/status-active";
import { FileObject } from "src/@type/Message";

export class SendMessageCommand {
    constructor(
      public readonly user: AuthUser,
      public readonly conversationId: string,
      public readonly messageText?: string,
      public readonly replyMessageId?: string,
      public readonly files?: Array<FileObject>,
      public readonly fileUUIds?: Array<string>,
      public readonly messageUUId?: string
    ) {
        this.validateMessageContent();
        this.validateFileLength();
        this.validateFilesSize();
        this.validateFileUUIdsLength();
    }

    private validateMessageContent() {
        if (this.messageText.length === 0 && this.files.length === 0 || (this.messageUUId.length === 0 && this.messageText.length > 0)) {
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

    private validateFileLength() {
        if (this.files.length > VALIDATION.FILE_UPLOAD.MAX_COUNT) {
            throw new ApplicationError(
                'Số lượng tải lên không được vượt quá 20 file!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.FILES_LENGTH_IS_TOO_LONG
            )
        }
    }

    private validateFilesSize() {
        for (let file of this.files) {
            if (file.mimetype.includes('image')) {
                if (file.size > VALIDATION.IMAGE_UPLOAD.MAX_SIZE) {
                    throw new ApplicationError(
                        'Dung lượng ảnh không đượt vượt quá 10mb!',
                        HttpStatus.BAD_REQUEST,
                        ExceptionCode.IMAGE_IS_TOO_LARGE
                    )
                }
            } else {
                if (file.size > VALIDATION.FILE_UPLOAD.MAX_SIZE) {
                    throw new ApplicationError(
                        'File không được vượt quá 100mb!',
                        HttpStatus.BAD_REQUEST,
                        ExceptionCode.FILE_IS_TOO_LARGE
                    )
                }    
            }
        }
    }

    private validateFileUUIdsLength() {
        if (Array.from(new Set(this.fileUUIds)).length != this.files.length) {
            throw new ApplicationError(
                'Id file không hợp lệ!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.INVALID_FILE_ID
            )
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