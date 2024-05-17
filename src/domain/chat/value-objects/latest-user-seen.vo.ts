import { ValueObject } from './base';
import { EmailVO } from './email.vo';

export class LatestUserSeen extends ValueObject {
  constructor(
    private readonly userId: string,
    private readonly seenAt: Date,
    private readonly avatar?: string,
  ) {
    super();
  }

  public getSeenAt(): Date {
    return this.seenAt;
  }

  public getAvatar(): string | null {
    return this.avatar;
  }

  public getUserId(): string {
    return this.userId;
  }
}
