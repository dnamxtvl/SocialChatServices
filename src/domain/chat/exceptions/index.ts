import { HttpException } from "@nestjs/common";

export const DomainErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
export type DomainErrorCode =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode];

export const DomainErrorDetailCode = {
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  USER_NAME_CAN_NOT_BE_EMPTY: 'USER_NAME_CAN_NOT_BE_EMPTY',
  INVALID_PASSWORD_FORMAT: 'INVALID_PASSWORD_FORMAT',
} as const;

export type DomainErrorDetailCode =
  (typeof DomainErrorDetailCode)[keyof typeof DomainErrorDetailCode];

export class DomainError extends HttpException {
  constructor(message: string, code: number, detailCode: number) {
    super({ message, detailCode }, code);
  }
}
  