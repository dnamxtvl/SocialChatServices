import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadFileCommand } from "../command/upload-file-command";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { FileObject } from "src/@type/Message";

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandle implements ICommandHandler<UploadFileCommand> {
  constructor(
    @InjectQueue('conversation') private conversationQueue: Queue
  ) {}

  async execute(command: UploadFileCommand): Promise<void> {
    const files = command.files.map((item, index) => ({
      ...item,
      fileId: command.fileUUIds[index]
    }));
    console.log(files);
    this.conversationQueue.add('upload_file', {
      files: files,
      userId: command.user.id,
    });
  }
}