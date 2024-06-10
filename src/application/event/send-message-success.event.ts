export class SendMessageSuccessEvent {
    constructor(
      public readonly conversationUser: string,
      public readonly dragonId: string,
    ) {}
  }