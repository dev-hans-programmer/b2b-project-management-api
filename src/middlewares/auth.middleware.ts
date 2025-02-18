import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../utils/app-error';

export const isAuthenticated = (
   req: Request,
   _res: Response,
   next: NextFunction
) => {
   if (!req.user || !req.user._id) throw new UnauthorizedException();
   next();
};
