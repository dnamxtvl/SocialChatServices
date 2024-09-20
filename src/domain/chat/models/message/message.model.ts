import { BaseModel } from '../base';;
import { TypeMessageEnum } from 'src/const/enums/message/type';
import { VALIDATION } from 'src/const/validation';
import { isURL } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { DomainError } from '../../exceptions';
import { ExceptionCode } from '../../enums/exception-code';
import { FileContent } from 'src/@type/Message';
import { ConversationModel } from '../conversation/conversation.model';

export class MessageModel extends BaseModel {
  constructor(
    private readonly type: TypeMessageEnum,
    private readonly conversationId: string,
    private readonly firstOfAvgTime: boolean,
    private readonly userSendId: string,
    private readonly id?: string,
    private readonly content?: string | Array<FileContent> | FileContent,
    private readonly parentId?: string,
    private readonly latestUserSeenId?: string,
    private readonly deviceId?: string,
    private readonly ipSend?: string,
    private readonly createdAt?: Date,
  ) {
    super();
    this.validateContent();
  }

  public getId(): string {
    return this.id;
  }

  public getContent(): string | Array<FileContent> | FileContent {
    return this.content;
  }

  public getType(): TypeMessageEnum {
    return this.type;
  }

  public getUserSendId(): string {
    return this.userSendId;
  }

  public getConversationId(): string {
    return this.conversationId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getDeviceId(): string | null {
    return this.deviceId;
  }

  public getLatestUserSeen(): string | null {
    return this.latestUserSeenId;
  }

  public getParentId(): string | null {
    return this.parentId;
  }

  public getIpSend(): string | null {
    return this.ipSend;
  }

  public getFirstOfAvgTime(): boolean {
    return this.firstOfAvgTime;
  }

  private validateContent(content: string | string[] = ''): void {
    if (this.type === TypeMessageEnum.TEXT && typeof content === 'string') {
      if (content.length > VALIDATION.MESSAGE.CONTENT.MAX_LENGTH) {
        throw new DomainError(
          'Tin nhắn quá dài!',
          HttpStatus.UNPROCESSABLE_ENTITY,
          ExceptionCode.MESSAGE_LENGTH_TO_BIG
        )
      }
    } else if (this.type === TypeMessageEnum.LINK && typeof this.content === 'string') {
      if (!isURL(this.content)) {
        throw new DomainError(
          'Link không hợp lệ!',
          HttpStatus.UNPROCESSABLE_ENTITY,
          ExceptionCode.INVALID_LINK
        );
      }
    } else if (this.type === TypeMessageEnum.FILES || this.type === TypeMessageEnum.IMAGES || this.type === TypeMessageEnum.VIDEOS) {
      if (!Array.isArray(this.content)) {
        throw new DomainError(
          'Tin nhắn không hợp lệ!',
          HttpStatus.UNPROCESSABLE_ENTITY,
          ExceptionCode.INVALID_MESSAGE_IN_MODEL_DOMAIN
        )
      }
      // this.content.map((item) => {
      //   if (!isURL(item)) {
      //     throw new DomainError(
      //       'Link không hợp lệ',
      //       HttpStatus.UNPROCESSABLE_ENTITY,
      //       ExceptionCode.INVALID_LINK
      //     );
      //   }
      // })
    }
  }

  public checkMessageReplyBelongToConversation(conversaion: ConversationModel): void {
    if (this.conversationId != conversaion.getId()) {
      throw new DomainError(
        'Tin nhán reply không thuộc về cuộc trò chuyện ' + conversaion.getName() + '!',
        HttpStatus.FORBIDDEN,
        ExceptionCode.INVALID_REPLY_MESSAGE
      )
    }
  }
}
  