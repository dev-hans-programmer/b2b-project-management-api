import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequestException } from '../utils/app-error';
import { config } from '../config/app.config';
import { HTTPSTATUS } from '../config/http.config';
import { sendResponse } from '../utils/common';
import { logger } from '../config/logger.config';

interface CustomError extends Error {
   code?: number;
}

const handleCastError = (err: any) =>
   new BadRequestException(`Invalid ${err.path}:${err.value}`);

const handleDuplicateError = (err: any) => {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   return new BadRequestException(
      `Duplicate field value: ${value}. Please use another value!`
   );
};

const sendDevError = (err: AppError, res: Response) => {
   sendResponse(
      res,
      err.status,
      {
         message: err.message,
         errorCode: err.errorCode,
         statusCode: err.statusCode,
         stack: err.stack,
      },
      err.message,
      err.statusCode
   );
   // res.status(err.statusCode).json({
   //    status: err.status,
   //    message: err.message,
   //    stack: err.stack,
   // errorCode: err.errorCode,
   // statusCode: err.statusCode,
   // });
};

const sendProdError = (err: AppError, res: Response) => {
   if (err.operational) {
      return sendResponse(
         res,
         err.status,
         {
            message: err.message,
            errorCode: err.errorCode,
            statusCode: err.statusCode,
         },
         err.message,
         err.statusCode
      );
   }
   logger.error(JSON.stringify(err));
   sendResponse(res, 'error', null);
};

export const errorHandler = (
   err: CustomError,
   _req: Request,
   res: Response,
   _next: NextFunction
) => {
   if (err.name === 'CastError') err = handleCastError(err);
   if (err.code === 11000) err = handleDuplicateError(err);

   if (err instanceof AppError) {
      if (config.NODE_ENV === 'development') {
         sendDevError(err, res);
      } else if (config.NODE_ENV === 'production') {
         sendProdError(err, res);
      }
   } else if (err instanceof SyntaxError) {
      sendResponse(res, 'fail', {
         message: 'Invalid JSON payload passed.',
         statusCode: HTTPSTATUS.BAD_REQUEST,
      });
   } else {
      logger.error(JSON.stringify(err));
      sendResponse(res, 'error', null);
   }
};
