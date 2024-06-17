import { TypeConversationEnum } from 'src/const/enums/conversation/type.enum.conversation';
import { BaseModel } from '../base';
import { VALIDATION } from 'src/const/validation';
import { DomainError } from '../../exceptions';
import { ExceptionCode } from '../../enums/exception-code';
import { HttpStatus } from '@nestjs/common';
import { UserModel } from '../user/user.model';
import { EXCEPTION_CODE_APPLICATION } from 'src/application/enums/exception-code.enum';
import { UserConversationModel } from './user-conversation.model';

export class ConversationModel extends BaseModel {
    constructor(
        private readonly name: string,
        private readonly createdBy: string,
        private readonly organizationId: number,
        private readonly type: TypeConversationEnum,
        private readonly latestActivity: Date,
        private readonly countMember: number,
        private readonly latestMessageId?: string,
        private readonly id?: string,
        private readonly avatar?: string | string[],
        private readonly createdAt?: Date,
        private readonly updatedAt?: Date,
    ) {
        super();
        this.validateName();
        this.validateLatestMessage();
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getOrganizationId(): number {
        return this.organizationId;
    }

    public getCreatedBy(): string {
        return this.createdBy;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public getType(): TypeConversationEnum {
        return this.type;
    }

    public getLatestMessageId(): string | null {
        return this.latestMessageId;
    }

    public getAvatar(): string | string[] | null {
        return this.avatar;
    }

    public getCountMember(): number {
        return this.countMember;
    }

    public getLatestActivity(): Date {
        return this.latestActivity;
    }

    private validateName(): void {
        if (this.name.length > VALIDATION.CONVERSATION.NAME.MAX_LENGTH) {
            throw new DomainError(
                'Tên cuộc trò chuyện quá dài!',
                HttpStatus.UNPROCESSABLE_ENTITY,
                ExceptionCode.CONVERSATION_NAME_TO_LONG
            );
        }
    }

    private validateLatestMessage(): void {
        if (this.latestMessageId && this.latestMessageId?.length != VALIDATION.MESSAGE.ID_LENGTH) {
            throw new DomainError(
                'Tin nhắn không hợp lệ!',
                HttpStatus.UNPROCESSABLE_ENTITY,
                ExceptionCode.LATEST_MESSAGE_INVALID
            )
        }
    }

    public checkUserSendIsSameOrganizationWithConversation(user: UserModel): void {
        if (this.getOrganizationId() !== user.getOrganizationId()) {
            throw new DomainError(
                'User với id ' + user.getId() + ' không thuộc đơn vị này!',
                HttpStatus.BAD_REQUEST,
                EXCEPTION_CODE_APPLICATION.USER_NOT_IN_ORGANIZATION
            );
        }
    }

    public checkIsValidMemberOfSingleConversation(userOfConversation: UserConversationModel[]): void {
        if (userOfConversation.length != VALIDATION.CONVERSATION.MIN_MEMBER) {
            throw new DomainError(
              'Cuộc trò chuyện không hợp lệ!',
              HttpStatus.NOT_FOUND,
              EXCEPTION_CODE_APPLICATION.INVALID_TYPE_CONVERSATION
            )
          }
    }
}