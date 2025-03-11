import { HTTPSTATUS, HttpStatusCodeType } from '../config/http.config';
import { ErrorCodeEnum, ErrorCodeEnumType } from '../enums/error-code.enum';

export class AppError extends Error {
   public readonly statusCode: HttpStatusCodeType;
   public readonly operational: boolean;
   public readonly status: 'fail' | 'error';
   public readonly errorCode?: ErrorCodeEnumType;

   constructor(
      message: string,
      statusCode?: number,
      errorCode?: ErrorCodeEnumType
   ) {
      super(message);
      this.statusCode = statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR;
      this.name = this.constructor.name;
      this.operational = true;
      this.errorCode = errorCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      Error.captureStackTrace(this, this.constructor);
   }
}

export class HttpException extends AppError {
   constructor(
      message: string,
      statusCode: HttpStatusCodeType,
      errorCode: ErrorCodeEnumType
   ) {
      super(message, statusCode, errorCode);
   }
}

export class InternalServerException extends AppError {
   constructor(message = 'Internal Server Error') {
      super(
         message,
         HTTPSTATUS.INTERNAL_SERVER_ERROR,
         ErrorCodeEnum.INTERNAL_SERVER_ERROR
      );
   }
}
export class NotFoundException extends AppError {
   constructor(message = 'Not Found') {
      super(message, HTTPSTATUS.NOT_FOUND, ErrorCodeEnum.RESOURCE_NOT_FOUND);
   }
}

export class BadRequestException extends AppError {
   constructor(message = 'Bad Request') {
      super(message, HTTPSTATUS.BAD_REQUEST, ErrorCodeEnum.VALIDATION_ERROR);
   }
}

export class UnauthorizedException extends AppError {
   constructor(message = 'Unauthorized') {
      super(
         message,
         HTTPSTATUS.UNAUTHORIZED,
         ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS
      );
   }
}
