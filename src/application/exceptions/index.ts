import { HttpException } from "@nestjs/common";

export const ApplicationErrorCode = {
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  } as const;
export type ApplicationErrorCode =
    (typeof ApplicationErrorCode)[keyof typeof ApplicationErrorCode];

export const ApplicationErrorDetailCode = {
    INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
    USER_NAME_CAN_NOT_BE_EMPTY: 'USER_NAME_CAN_NOT_BE_EMPTY',
    INVALID_PASSWORD_FORMAT: 'INVALID_PASSWORD_FORMAT',
    } as const;

export type ApplicationErrorDetailCode =
    (typeof ApplicationErrorDetailCode)[keyof typeof ApplicationErrorDetailCode];

export class ApplicationError extends HttpException {
    constructor(message: string, code: number, detailCode: number) {
        super({ message, detailCode }, code);
    }
}
    