import { HttpException } from '@nestjs/common';
import { ResponseErrorInterface } from './common.interface';

export class HttpExceptionCustom extends HttpException {
  constructor(
    {
      errorMsg,
      errorCode,
      fieldError,
    }: {
      errorMsg?: string;
      errorCode?: string;
      fieldError?: {
        [fieldname: string]: string[];
      };
    },
    statusCode: number,
  ) {
    const message: ResponseErrorInterface = {
      success: false,
      data: null,
      errors: {
        errorMsg,
        errorCode,
        fieldError,
      },
    };
    super(message, statusCode);
  }
}
