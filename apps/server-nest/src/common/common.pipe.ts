import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpExceptionCustom } from './common.exception';
import { ValidationError as ValidationErrorYup } from 'yup';

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (this.isEmpty(value)) {
      throw new HttpExceptionCustom(
        {
          errorMsg: 'Validation failed: No body submitted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToInstance(metatype, value);

    if (typeof object !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpExceptionCustom(
        {
          fieldError: this.buildError(errors),
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

@Injectable()
export class ResponsePipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log({
      value,
      metatype,
    });
  }
}

const serializeValidationError = (err: ValidationErrorYup) => {
  const res = {};

  err.inner.map(({ path, message }) => {
    if (path) {
      res[path] = [message];
    }
  });
  return res;
};

@Injectable()
export class YupValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const { schema } = metatype?.prototype;
    if (!schema) return value;

    try {
      await schema.validate(value, { abortEarly: false });
    } catch (err) {
      throw new HttpExceptionCustom(
        {
          fieldError: serializeValidationError(err),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return value;
  }
}
