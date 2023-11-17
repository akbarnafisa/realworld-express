import { DatabaseError } from 'pg';
import type { ErrorRequestHandler } from 'express';
import { responseFormat } from 'validator';
import logger from '../app/logger';

const dbError: ErrorRequestHandler = (err, req, res, next) => {

  if (!err) {
    next();
  }

  if (err instanceof DatabaseError) {
    const checkColumnName = err.detail?.match(/\((.*?)\)/);
    const columnName = checkColumnName ? checkColumnName[1] : 'unknown';
    switch (err.code) {
      case '23505':
        return res.status(422).json(
          responseFormat({
            data: null,
            success: false,
            error: {
              errorMsg: `The field ${columnName} is not unique`,
            },
          }),
        );
      default:
        logger.debug(`Unhandled error with code ${err.code} in DatabaseError`);
        return res.status(500).json(
          responseFormat({
            data: null,
            success: false,
            error: {
              errorMsg: err.message,
              errorCode: err.code,
            },
          }),
        );
    }
  } else {
    next(err);
  }
};

export default dbError;
