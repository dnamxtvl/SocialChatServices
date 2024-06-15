import { BaseModel } from '../base';

export class UserBlockModel extends BaseModel {
  constructor(
    private readonly id: number,
    private readonly userid: string,
    private readonly blockedUserId: string,
    private readonly createdAt?: Date
  ) {
    super();
  }

  public getId(): number {
    return this.id;
  }

  public getUserid(): string {
    return this.userid;
  }

  public getBlockedUserId(): string {
    return this.blockedUserId;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }
}
  