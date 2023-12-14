import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommonPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToInstance(metatype, value);

    if (typeof object !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        {
          errors: this.buildError(errors),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return value;
  }

  buildError(errors: ValidationError[]) {
    const result = {};

    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        result[error.property] = this.buildError(error.children);
      } else if (error.constraints) {
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
