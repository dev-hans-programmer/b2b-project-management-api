import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequestException } from '../utils/app-error';
import { config } from '../config/app.config';
import { HTTPSTATUS } from '../config/http.config';

const handleCastError = (err: any) =>
   new BadRequestException(`Invalid ${err.path}:${err.value}`);

const sendDevError = (err: AppError, res: Response) => {
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
   });
};

const sendProdError = (err: AppError, res: Response) => {
   if (err.operational) {
      return res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
         errorCode: err.errorCode,
         statusCode: err.statusCode,
      });
   }
   res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      errorCode: err.errorCode,
      statusCode: err.statusCode,
   });
};

export const errorHandler = (
   err: Error,
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   if (err.name === 'CastError') err = handleCastError(err);

   if (err instanceof AppError) {
      if (config.NODE_ENV === 'development') {
         sendDevError(err, res);
      } else if (config.NODE_ENV === 'production') {
         sendProdError(err, res);
      }
   } else if (err instanceof SyntaxError) {
      res.status(HTTPSTATUS.BAD_REQUEST).json({
         status: 'fail',
         message: 'Invalid JSON payload passed.',
         statusCode: HTTPSTATUS.BAD_REQUEST,
      });
   } else {
      console.log(err);
      res.status(500).json({
         status: 'error',
         message: 'Something went wrong',
      });
   }
};
