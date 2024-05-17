import { ValueObject } from './base';
import { EmailVO } from './email.vo';

export class UserSendVO extends ValueObject {
  constructor(
    private readonly id: string,
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly email: EmailVO,
    private readonly organizationName: string,
    private readonly avatar?: string,
    private readonly unitRoomName?: string,
  ) {
    super();
  }

  public getId(): string
  {
    return this.id;
  }

  public getFirstName(): string
  {
    return this.firstName;
  } 

  public getLastName(): string
  {
    return this.lastName;
  }

  public getEmail(): EmailVO
  {
    return this.email
  }

  public getOrganizationName(): string
  {
    return this.organizationName
  }

  public getAvatar(): string | null
  {
    return this.avatar;
  }

  public getUnitNameRoom(): string | null
  {
    return this.unitRoomName;
  }
}
