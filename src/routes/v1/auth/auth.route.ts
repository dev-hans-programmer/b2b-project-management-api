import express from 'express';
import passport from 'passport';
import { config } from '../../../config/app.config';
import {
   googleLoginCallback,
   registerController,
} from '../../../controllers/v1/auth/auth.controller';
import { registerSchema } from '../../../validation/auth.validation';
import validateInput from '../../../utils/validate-input';

const failureCallback = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const router = express.Router();

router.route('/').post(validateInput(registerSchema), registerController);

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
