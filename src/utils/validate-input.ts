import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { BadRequestException } from './app-error';

export default function validateInput(schema: ZodSchema) {
   return function (req: Request, _res: Response, next: NextFunction) {
      try {
         const parsedData = schema.parse(req.body);
         req.body = parsedData;
         next();
      } catch (err) {
         if (err instanceof ZodError) {
            const msg = (
               err.issues as {
                  path: string[];
                  received: string;
                  expected: string;
                  message: string;
               }[]
            )
               .map(({ path, received, expected, message }) =>
                  message !== 'Required'
                     ? message
                     : received === 'undefined'
                     ? `${path[0]} is required`
                     : `${path[0]} is required as ${expected} but received ${received}`
               )
               .join(', ');
            throw new BadRequestException(msg);
         }
         throw err;
      }
   };
}
