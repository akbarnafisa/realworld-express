import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToClass(metadata.metatype, value);

    if (typeof object !== 'object') {
      return value;
    }
    const errors = await validate(object);

    console.log({
      errors,
      object,
    });

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      {
        errors: this.buildError(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  buildError(errors: ValidationError[]) {
    const result = {};

    errors.forEach((error) => {
      console.log({ error });
      if (error.children && error.children.length > 0) {
        result[error.property] = this.buildError(error.children);
      } else {
        result[error.property] = Object.values(error.constraints);
      }
    });

    return result;
  }

  isEmpty(value: any) {
    if (!value) {
      return true;
    }
    if (Object.keys(value).length > 0) {
      return false;
    }
  }
}
