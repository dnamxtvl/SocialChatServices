import { Controller, Get, Param, Req, Post, Res, Body, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, BadRequestException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/chat/repository/user.repository';
import { UseGuards } from '@nestjs/common';
import { OrganiztionGuard } from '../guard/organization.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/config/image/upload.config.image';
import { APPLICATION_CONST } from 'src/const/application';
import { VALIDATION } from 'src/const/validation';
import { logger } from 'src/logs/nest.log';
import { BaseController } from './base.controller';
import { Response } from 'express';
import { SendMessageCommand } from 'src/application/command/send-message.command';
import { CommandBus } from '@nestjs/cqrs';
import { GetAuthUser } from '../decorator/auth.decorator';
import { AuthUser } from 'src/@type/User';

@Controller()
export class MessageController extends BaseController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly commandBus: CommandBus
    ) {
    super();
  }

  @UseGuards(OrganiztionGuard)
  @Get('/message/:id')
  async findById(@Param('id') id: string, @Req() req) {
    const test = await this.userRepository.findById(id);
    return test;
  }

  @Post('/send-message/:conversationId')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      VALIDATION.FILE_UPLOAD.MAX_COUNT,
      imageUploadOptions(APPLICATION_CONST.PATH_UPLOAD_FILE.CONVERSATION),
    ),
  )
  async sendMessage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: VALIDATION.FILE_UPLOAD.MAX_SIZE,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
    @Res() res: Response,
    @Param('conversationId') conversationId: string,
    @GetAuthUser() user: AuthUser,
    @Body('message') message?: string,
    @Body('replyMessageId') replyMessageId?: string,
  ) {
    try {
      await this.commandBus.execute(
        new SendMessageCommand(user.id, conversationId, message ?? '', replyMessageId ?? '' , files),
      );

      return this.responseWithSuccess(res, null);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }
}
