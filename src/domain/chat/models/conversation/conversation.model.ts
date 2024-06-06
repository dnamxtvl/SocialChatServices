import { TypeConversationEnum } from 'src/const/enums/conversation/type.enum.conversation';
import { BaseModel } from '../base';
import { VALIDATION } from 'src/const/validation';
import { DomainError } from '../../exceptions';
import { ExceptionCode } from '../../enums/exception-code';
import { HttpStatus } from '@nestjs/common';

export class ConversationModel extends BaseModel {
    constructor(
        private readonly name: string,
        private readonly createdBy: string,
        private readonly organizationId: number,
        private readonly type: TypeConversationEnum,
        private readonly latestActivity: Date,
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
}