export class ListConversationByUserCommand {
    constructor(
      public readonly userId: string,
      public readonly skip: number
    ) {}
  }