import { NextFunction, Request, Response } from 'express';

type AsyncController = (
   req: Request,
   res: Response,
   next: NextFunction
) => Promise<any>;

const asyncHandler =
   (fn: AsyncController): AsyncController =>
   (req, res, next) =>
      fn(req, res, next).catch(next);

export default asyncHandler;
