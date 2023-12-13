import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.UNPROCESSABLE_ENTITY;
        response.status(status).json({
          message: `The field ${exception.meta?.target} is not unique`,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          errors: `${exception.meta?.cause}`,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
