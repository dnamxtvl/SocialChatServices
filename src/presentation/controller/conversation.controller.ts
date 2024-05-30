import { Body, Controller, Get, Param, Post, UseInterceptors, UploadedFile, UseGuards, MaxFileSizeValidator, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateConversationCommand } from 'src/application/command/create-conversation.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/config/image/upload.config.image';
import { OrganiztionGuard } from '../guard/organization.guard';
import { CreateConversationDTO } from '../dtos/create-conversation.dto';
import { logger } from 'src/logs/nest.log';
import { VALIDATION } from 'src/const/validation';
import { APPLICATION_CONST } from 'src/const/application';

@Controller()
export class ConversationController {
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  @UseGuards(OrganiztionGuard)
  @Post('/conversation/create')
  @UseInterceptors(FileInterceptor('avatar', imageUploadOptions(APPLICATION_CONST.PATH_UPLOAD_FILE.CONVERSATION)))
  async organiztionCreate(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: VALIDATION.IMAGE_UPLOAD.MAX_SIZE }),
        new FileTypeValidator({ fileType: VALIDATION.IMAGE_UPLOAD.FILE_TYPE }),
      ],
    }),
  ) avatar: Express.Multer.File, @Body () createConversationDTO: CreateConversationDTO) {
    console.log(avatar);
    try {
      return await this.commandBus.execute(
        new CreateConversationCommand(
          createConversationDTO.name,
          createConversationDTO.listUserId
        )
      );
    } catch (error) {
      console.log(error);
      logger.error(error.stack);
    }
    
  }
}
