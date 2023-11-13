import type { ErrorRequestHandler } from 'express';
import { ResponseError, responseFormat } from 'validator';
import { logger } from '../application/logging';

export const errorMiddleware: ErrorRequestHandler = async (err, _, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json(
        responseFormat({
          success: false,
          data: null,
          error: {
            errorMsg: err.message,
            errorCode: err.errorCode,
          },
        }),
      )
      .end();
  } else {
    logger.error(err);
    res
      .status(err.status || 500)
      .json(
        responseFormat({
          success: false,
          data: null,
          error: {
            errorMsg: err.message,
            errorCode: err.errorCode,
          },
        }),
      )
      .end();
  }
};
