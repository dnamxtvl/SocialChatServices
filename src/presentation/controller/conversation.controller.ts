import { Body, Controller, Get, Param, Post, UseInterceptors, UploadedFile, UseGuards,
  MaxFileSizeValidator, ParseFilePipe, FileTypeValidator, Res, UsePipes, ValidationPipe,
  Query} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateConversationCommand } from 'src/application/command/create-conversation.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/config/image/upload.config.image';
import { OrganiztionGuard } from '../guard/organization.guard';
import { CreateConversationDTO } from '../dtos/create-conversation.dto';
import { logger } from 'src/logs/nest.log';
import { VALIDATION } from 'src/const/validation';
import { APPLICATION_CONST } from 'src/const/application';
import { BaseController } from './base.controller';
import { Response } from 'express';
import { GetAuthUser } from '../decorator/auth.decorator';
import { AuthUser } from 'src/@type/User';
import { ListConversationByUserCommand } from 'src/application/command/list-conversaion-by-user.command';

@Controller()
export class ConversationController extends BaseController {
  constructor(
    private readonly commandBus: CommandBus
  ) {
    super();
  }

  @UseGuards(OrganiztionGuard)
  @Post('/user/conversation/create')
  @UseInterceptors(FileInterceptor('avatar', imageUploadOptions(APPLICATION_CONST.PATH_UPLOAD_FILE.CONVERSATION)))
  async organiztionCreate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: VALIDATION.IMAGE_UPLOAD.MAX_SIZE }),
          new FileTypeValidator({ fileType: VALIDATION.IMAGE_UPLOAD.FILE_TYPE }),
        ], fileIsRequired: false
      }),
    ) avatar: Express.Multer.File,
    @Res() res: Response,
    @GetAuthUser() user: AuthUser,
    @Body () createConversationDTO: CreateConversationDTO) {
    try {
      await this.commandBus.execute(
        new CreateConversationCommand(
          createConversationDTO.name,
          createConversationDTO.listUserId,
          user,
          avatar?.path,
        )
      );

      return this.responseWithSuccess(res, null);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }

  @Get('/user/conversation/list/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getConversation(@Res() res: Response, @GetAuthUser() user: AuthUser, @Query('page') page?: number) {
    try {
      const listConversation = await this.commandBus.execute(
        new ListConversationByUserCommand(user.id, page ?? APPLICATION_CONST.CONVERSATION.FIRST_PAGE)
      )

      return this.responseWithSuccess(res, listConversation);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }

  @Get('/user/view-conversation/:id')
  async getConversationById(@Res() res: Response, @GetAuthUser() user: AuthUser, @Param('id') id: string) {
    try {
      
      //return this.responseWithSuccess(res, listConversation);
    } catch (error) {
      logger.error(error.stack);

      return this.responseWithError(res, error);
    }
  }
}
