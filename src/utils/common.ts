import { Response } from 'express';

export const sendResponse = (
   response: Response,
   status: 'success' | 'fail' | 'error',
   data: Record<string, any> | null = null,
   message?: string | null,
   statusCode?: number
) => {
   const payload: Record<string, any> = { status };

   if (status === 'success' && data) {
      payload.data = { ...data, ...(message ? { message } : {}) };
   } else if (status === 'fail' && data) {
      payload.data = { ...data, ...(message ? { message } : {}) };
   } else if (status === 'error') {
      payload.message = message || 'An unexpected error occurred';
   }

   return response
      .status(
         statusCode ||
            (status === 'success' ? 200 : status === 'fail' ? 400 : 500)
      )
      .json(payload);
};
