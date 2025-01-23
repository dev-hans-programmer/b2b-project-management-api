import { Request, Response } from 'express';

const getTestHandler = (req: Request, res: Response) => {
   res.send('Hello World');
};

export { getTestHandler };
