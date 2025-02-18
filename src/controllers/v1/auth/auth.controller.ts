import passport from 'passport';

import asyncHandler from '../../../middlewares/async-handler.middleware';

import { config } from '../../../config/app.config';
import { UserDocument } from '../../../models/user.model';
import { registerService } from '../../../services/auth.service';
import { HTTPSTATUS } from '../../../config/http.config';
import { UnauthorizedException } from '../../../utils/app-error';

export const googleLoginCallbackController = asyncHandler(async (req, res) => {
   const currentWorkspace = (req.user as UserDocument)?.currentWorkspace;

   if (!currentWorkspace)
      return res.redirect(
         `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
   return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
   );
});

export const registerController = asyncHandler(async (req, res) => {
   const { userId } = await registerService(req.body);
   res.status(HTTPSTATUS.CREATED).json({ message: `User created ${userId}` });
});

export const loginController = asyncHandler(async (req, res, next) => {
   passport.authenticate(
      'local',
      (
         err: Error | null,
         user: Express.User | false,
         info: { message: string } | undefined
      ) => {
         if (err) next(err);

         if (!user)
            return next(new UnauthorizedException('Invalid email or password'));

         req.logIn(user, (err) => {
            if (err) throw next(err);

            return res.json({ message: 'Logged In successfully', user });
         });
      }
   )(req, res, next);
});

export const logoutController = asyncHandler(async (req, res, next) => {
   req.logout((err) => {
      if (err) next(err);
   });

   req.session = null;

   res.json({ message: 'Logged Out Successfully' });
});
