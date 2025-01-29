import express from 'express';
import passport from 'passport';
import { config } from '../../../config/app.config';
import { googleLoginCallback } from '../../../controllers/v1/auth/auth.controller';

const failureCallback = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const router = express.Router();

router.get(
   '/google',
   passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
   '/google/callback',
   passport.authenticate('google', { failureRedirect: failureCallback }),
   googleLoginCallback
);

export { router as authRouter };
