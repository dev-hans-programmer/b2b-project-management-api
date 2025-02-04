import asyncHandler from '../../../middlewares/async-handler.middleware';

import { config } from '../../../config/app.config';
import { UserDocument } from '../../../models/user.model';

export const googleLoginCallback = asyncHandler(async (req, res) => {
   const currentWorkspace = (req.user as UserDocument)?.currentWorkspace;

   if (!currentWorkspace)
      return res.redirect(
         `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
   return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
   );
});
