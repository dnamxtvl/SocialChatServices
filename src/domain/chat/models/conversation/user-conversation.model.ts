import { BaseModel } from "../base";
import { DomainError } from "../../exceptions";
import { ExceptionCode } from "../../enums/exception-code";
import { HttpStatus } from "@nestjs/common";
import { VALIDATION } from "src/const/validation";

export class UserConversationModel extends BaseModel {
    constructor(
        private readonly userId: string,
        private readonly conversationId: string,
        private latestMessageId: string,
        private readonly latestActivity: Date,
        private noUnredMessage: number,
        private readonly disabledNotify: boolean,
        private readonly expiredDisabledNotifyAt: Date | null,
        private readonly createdAt?: Date,
        private readonly updatedAt?: Date,
        private id?: string,
    ) {
        super();
        this.validateConversationId();
        this.validateLatestMessage();
    }

    public getId(): string {
        return this.id;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getConversationId(): string {
        return this.conversationId;
    }

    public getLatestMessageId(): string {
        return this.latestMessageId;
    }

    public getNoUnredMessage(): number {
        return this.noUnredMessage;
    }

    public getDisabledNotify(): boolean {
        return this.disabledNotify;
    }

    public getExpiredDisabledNotifyAt(): Date | null {
        return this.expiredDisabledNotifyAt;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public getLatestActivity(): Date {
        return this.latestActivity;
    }

    public setId(id: string): void {
        this.id = id;
    }

    private validateLatestMessage(): void {
        if (this.latestMessageId?.length != VALIDATION.MESSAGE.ID_LENGTH) {
            throw new DomainError(
                'Id tin nhắn không hợp lệ!',
                HttpStatus.UNPROCESSABLE_ENTITY,
                ExceptionCode.LATEST_MESSAGE_INVALID
            )
        }
    }

    private validateConversationId(): void {
        if (this.conversationId?.length != VALIDATION.CONVERSATION.ID_LENGTH) {
            throw new DomainError(
                'Id cuộc trò chuyên hợp lệ!',
                HttpStatus.UNPROCESSABLE_ENTITY,
                ExceptionCode.CONVERSATION_LENGTH_INVALID
            )
        }
    }

    public setLatestMessageId(latestMessageId: string): void {
        this.latestMessageId = latestMessageId;
    }

    public incrementNoUnredMessage(): void {
        this.noUnredMessage++;
    }
}