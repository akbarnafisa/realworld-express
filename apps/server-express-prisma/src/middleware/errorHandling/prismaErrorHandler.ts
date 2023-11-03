import { ErrorRequestHandler } from 'express';
import logger from '../../utils/logger';
import { Prisma } from '@prisma/client';

export const prismaErrorHandler: ErrorRequestHandler = async (err, _, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(422).json({ errors: `the field ${err.meta?.target} is not unique` });
      case 'P2025':
        return res.status(422).json({
          errors: `${err.meta?.cause}`,
        });
      default:
        logger.debug(`Unhandled error with code ${err.code} in prismaErrorHandler`);
        return res.sendStatus(500);
    }
  } else {
    next(err);
  }
};
