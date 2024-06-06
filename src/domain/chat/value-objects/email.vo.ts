import { ValueObject } from './base';
import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../enums/exception-code';
import { DomainError } from '../exceptions';
import { VALIDATION } from 'src/const/validation';

export class EmailVO extends ValueObject {
  constructor(private readonly value: string) {
    super();

    const emailRegex = VALIDATION.EMAIL_FORMAT;
    const isValidEmail = emailRegex.test(value);

    if (
      !value ||
      value.length === 0 ||
      value.length >= VALIDATION.EMAIL.MAX_LENGTH ||
      value.length <= VALIDATION.EMAIL.MIN_LENGTH ||
      !isValidEmail
    ) {
      throw new DomainError(
        'Email không hợp lệ!',
        HttpStatus.UNPROCESSABLE_ENTITY,
        ExceptionCode.INVALID_EMAIL_FORMAT_VALUE_OBJECT,
      );
    }
  }

  public getEmail(): string {
    return this.value;
  }
}
