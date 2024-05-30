import { ArgumentMetadata, Injectable, BadRequestException, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationPipeCustom extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(
          error.getResponse(),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }
}
