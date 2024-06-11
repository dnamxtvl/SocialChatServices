import { EmailVO } from '../../value-objects/email.vo';
import { BaseModel } from '../base';
import { GenderVO } from '../../value-objects/gender.vo';
import { TypeAccountEnum } from 'src/const/enums/user/type-account';
import { UserConversationModel } from '../conversation/user-conversation.model';
import { DomainError } from '../../exceptions';
import { HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE_APPLICATION } from 'src/application/enums/exception-code.enum';

export class UserModel extends BaseModel {
  constructor(
    private readonly id: string,
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly email: EmailVO,
    private readonly organizationId: number,
    private readonly typeAccount: TypeAccountEnum,
    private readonly phoneNumber?: string,
    private readonly avatar?: string,
    private readonly gender?: GenderVO,
    private readonly unitRoomId?: number,
    private readonly lastActivityAt?: Date,
    private readonly statusActive?: boolean,
    private readonly createdAt?: Date
  ) {
    super();
  }

  public getId(): string {
    return this.id;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): EmailVO {
    return this.email;
  }

  public getPhoneNumber(): string | null {
    return this.phoneNumber;
  }

  public getAvatar(): string | null {
    return this.avatar;
  }

  public getGender(): GenderVO {
    return this.gender;
  }

  public getLastActivityAt(): Date | null {
    return this.lastActivityAt;
  }

  public getStatusActive(): boolean {
    return this.statusActive;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }

  public getOrganizationId(): number {
    return this.organizationId;
  }

  public getUnitRoomId(): number | null {
    return this.unitRoomId;
  }

  public getTypeAccount(): TypeAccountEnum {
    return this.typeAccount;
  }

  public checkUserInConversation (userOfConversation: UserConversationModel[] | []): void {
    if (userOfConversation.length === 0 || userOfConversation.map((user: UserConversationModel) => user.getUserId()).indexOf(this.id) === -1) {
      throw new DomainError(
        'User với id ' + this.id + ' không thuộc cuộc trò chuyện!',
        HttpStatus.BAD_REQUEST,
        EXCEPTION_CODE_APPLICATION.USER_NOT_IN_CONVERSATION_WHEN_SEND_MESSAGE,
      );
    }
  }
}
  