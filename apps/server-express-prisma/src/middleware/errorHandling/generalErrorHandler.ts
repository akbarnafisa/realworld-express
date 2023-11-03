import { ErrorRequestHandler } from 'express';
import { ResponseError } from 'validator';
import logger from '../../utils/logger';

export const generalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    const data: {
      error: string;
      errorCode?: string;
    } = {
      error: err.message,
    };

    if (err.errorCode) {
      data.errorCode = err.errorCode;
    }
    res.status(err.status).json(data).end();
  } else {
    logger.error(`Unhandled error in generalErrorHandler`);
    logger.error(`${err.message}\n${err.name}\n${err.stack}`);
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
