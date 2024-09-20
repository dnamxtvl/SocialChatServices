import { Controller, Get, Param, Req, Post, Res, Body, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
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
import { UploadFileCommand } from 'src/application/command/upload-file-command';
import { FileObject } from 'src/@type/Message';

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
    @Body('fileUUIds') fileUUIds: string,
    @Body('message') message?: string,
    @Body('messageUUId') messageUUId?: string,
    @Body('replyMessageId') replyMessageId?: string,
  ) {
    try {
      let fileUUIdsArr = [];
      if (fileUUIds) {
        fileUUIdsArr = fileUUIds.split(',').map((fileUUId: string) => {
          return fileUUId;
        });
      }

      let filesObject: Array<FileObject> = [];
      if (files && Array.isArray(files) && files.length > 0) {
        filesObject = files.map((file: Express.Multer.File) => {
          return  {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            buffer: file.buffer.toString('base64'),
          }
        });
      }

      await this.commandBus.execute(
        new SendMessageCommand(user, conversationId, message ?? '', replyMessageId ?? '' , filesObject, fileUUIdsArr, messageUUId ?? ''),
      );

      return this.responseWithSuccess(res, null);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }

  @Post('/upload-files')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      VALIDATION.FILE_UPLOAD.MAX_COUNT,
    ),
  )
  async uploadFiles(
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
    @GetAuthUser() user: AuthUser,
    @Body('fileUUIds') fileUUIds: Array<string>,
  ) {
    try {
      let filesObject = files.map((file: Express.Multer.File) => {
        return  {
          name: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          buffer: file.buffer
        }
      })
      await this.commandBus.execute(
        new UploadFileCommand(user, filesObject, Array.from(new Set(fileUUIds))),
      );

      return this.responseWithSuccess(res, null);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }
}
