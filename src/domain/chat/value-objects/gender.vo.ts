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
      throw new DomainError(
        'Giới tính không hợp lệ',
        HttpStatus.UNPROCESSABLE_ENTITY,
        ExceptionCode.INVALID_GENDER_FORMAT_VALUE_OBJECT
      );
    }
  }
}
