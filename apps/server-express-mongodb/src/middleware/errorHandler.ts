import { ErrorRequestHandler } from 'express';
import { ResponseError } from 'validator';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    logger.error(err.message);
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
