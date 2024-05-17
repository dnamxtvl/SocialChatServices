import { BaseModel } from '../base';;
import { TypeMessageEnum } from 'src/const/enums/message/type';
import { VALIDATION } from 'src/const/validation';
import { isURL } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { DomainError } from '../../exceptions';
import { ExceptionCode } from '../../enums/exception-code';
import { UserSendVO } from '../../value-objects/user-send.vo';
import { Types } from 'mongoose';
import { LatestUserSeen } from '../../value-objects/latest-user-seen.vo';

export class MessageModel extends BaseModel {
  constructor(
    private readonly type: TypeMessageEnum,
    private readonly conversationId: Types.ObjectId,
    private readonly createdAt: Date,
    private readonly firstOfAvgTime: boolean,
    private readonly id?: string,
    private readonly content?: string | string[],
    private readonly userSend?: UserSendVO,
    private readonly deviceId?: string,
    private readonly latestUserSeen?: LatestUserSeen,
    private readonly parentId?: string,
    private readonly ipSend?: string,
  ) {
    super();
    this.validateContent();
  }

  public getId(): string {
    return this.id;
  }

  public getContent(): string | string[] {
    return this.content;
  }

  public getType(): TypeMessageEnum {
    return this.type;
  }

  public getUserSend(): UserSendVO {
    return this.userSend;
  }

  public getConversationId(): Types.ObjectId {
    return this.conversationId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getDeviceId(): string | null {
    return this.deviceId;
  }

  public getLatestUserSeen(): LatestUserSeen | null {
    return this.latestUserSeen;
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
        throw new DomainError({
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Message quá dài!',
          info: {
            detailCode: ExceptionCode.MESSAGE_LENGTH_TO_BIG
          },
        })
      }
    } else if ((this.type === TypeMessageEnum.LINK || this.type === TypeMessageEnum.IMAGE || this.type === TypeMessageEnum.VIDEO || this.type === TypeMessageEnum.AUDIO) && typeof content === 'string') {
      if (!isURL(content)) {
        throw new DomainError({
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Link không hợp lệ!',
          info: {
            detailCode: ExceptionCode.INVALID_LINK,
          },
        });
      }
    } else if (this.type === TypeMessageEnum.FILES || this.type === TypeMessageEnum.IMAGES || this.type === TypeMessageEnum.VIDEOS) {
      if (!Array.isArray(content)) {
        throw new DomainError({
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Message không hợp lệ!',
          info: {
            detailCode: ExceptionCode.INVALID_MESSAGE_IN_MODEL_DOMAIN
          },
        })
      }
      content.map((item) => {
        if (!isURL(item)) {
          throw new DomainError({
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Link không hợp lệ!',
            info: {
              detailCode: ExceptionCode.INVALID_LINK,
            },
          });
        }
      })
    }
  }
}
  