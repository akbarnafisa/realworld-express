import type { ErrorRequestHandler } from 'express';
import { ResponseError } from 'validator';
import { logger } from '../application/logging';

export const errorMiddleware: ErrorRequestHandler = async (err, _, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    logger.error(err);
    res
      .status(err.status || 500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
