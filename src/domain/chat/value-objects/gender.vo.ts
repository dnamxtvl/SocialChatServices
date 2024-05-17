import { ValueObject } from './base';
import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../enums/exception-code';
import { DomainError } from '../exceptions';
import { VALIDATION } from 'src/const/validation';

export class GenderVO extends ValueObject {
  constructor(input: number) {
    super();

    if (
      input !== VALIDATION.GENDER.MALE && input !== VALIDATION.GENDER.FEMALE && input !== VALIDATION.GENDER.OTHER
    ) {
      throw new DomainError({
        code: HttpStatus.BAD_REQUEST,
        message: 'Invalid email format',
        info: {
          detailCode: ExceptionCode.INVALID_GENDER_FORMAT_VALUE_OBJECT,
        },
      });
    }
  }
}
