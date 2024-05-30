import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from 'src/logs/nest.log';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && response !== null
          ? response
          : { message: response };
    } else {
      message = 'Internal server error';
    }

    logger.error(exception);

    response.status(status).json({
      message: typeof message == 'object' ? message.error : message,
      errors: typeof message == 'object' ? message.message : {
        code: message.code,
      },
    });
  }
}
