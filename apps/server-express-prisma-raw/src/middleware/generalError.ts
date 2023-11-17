import { ErrorRequestHandler } from 'express';
import logger from '../app/logger';
import { ResponseError, responseFormat } from 'validator';

const generalError: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .send(
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
            // errorCode: err.code,
          },
        }),
      )
      .end();
  }
};

export default generalError;
