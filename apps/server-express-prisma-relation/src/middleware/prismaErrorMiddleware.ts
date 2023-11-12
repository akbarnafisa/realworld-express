import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { logger } from '../application/logging';

export const prismaErrorMiddleware: ErrorRequestHandler = (err, _, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(422).json({
          success: false,
          data: null,
          error: {
            errorMsg: `The field ${err.meta?.target} is not unique`,
          },
        });
      case 'P2025':
        return res.status(422).json({
          success: false,
          data: null,
          error: {
            errorMsg: `${err.meta?.cause}`,
          },
        });
      default:
        logger.debug(`Unhandled error with code ${err.code} in prismaErrorHandler`);
        return res.sendStatus(500);
    }
  } else {
    next(err);
  }
};
