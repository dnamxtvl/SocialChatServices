import { ApplicationError } from "../exceptions";
import { HttpStatus } from "@nestjs/common";
import { AuthUser } from "src/@type/User";
import { VALIDATION } from "src/const/validation";
import { ExceptionCode } from "src/domain/chat/enums/exception-code";
import { UserModel } from "src/domain/chat/models/user/user.model";
import { EmailVO } from "src/domain/chat/value-objects/email.vo";
import { UserStatusActiveEnum } from "src/const/enums/user/status-active";

export class UserViewConversationCommand {
    constructor(
      public readonly user: AuthUser,
      public readonly conversationId: string,
    ) {
        this.validateConversationId();
    }

    private validateConversationId() {
        if (!this.conversationId && this.conversationId.length !== VALIDATION.CONVERSATION.ID_LENGTH) {
            throw new ApplicationError(
                'Id cuộc trò chuyện không hợp lệ!!',
                HttpStatus.BAD_REQUEST,
                ExceptionCode.MESSAGE_TEXT_IS_REQUIRED
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