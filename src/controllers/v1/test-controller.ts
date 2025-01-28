import { Request, Response } from 'express';
import { BadRequestException } from '../../utils/app-error';

const getTestHandler = (req: Request, res: Response) => {
   throw new BadRequestException();
   res.send('Hello World');
};

export { getTestHandler };
