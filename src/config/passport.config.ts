import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { config } from './app.config';
import { Request } from 'express';
import { NotFoundException } from '../utils/app-error';
import {
   loginOrCreateAccountService,
   verifyUserService,
} from '../services/auth.service';
import { ProviderEnum } from '../enums/account-provider.enum';

passport.use(
   new GoogleStrategy(
      {
         clientID: config.GOOGLE_CLIENT_ID,
         clientSecret: config.GOOGLE_CLIENT_SECRET,
         callbackURL: config.GOOGLE_CALLBACK_URL,
         scope: ['profile', 'email'],
         passReqToCallback: true,
      },
      async (
         _req: Request,
         _accessToken: string,
         _refreshToken: string,
         profile,
         done
      ) => {
         try {
            const { email, sub: googleId, picture } = profile._json;
            if (!googleId) throw new NotFoundException('Google Id not found');

            const user = await loginOrCreateAccountService({
               name: profile.displayName,
               email,
               provider: ProviderEnum.GOOGLE,
               providerId: googleId,
               profilePicture: picture,
            });
            done(null, user);
         } catch (err) {
            done(err, false);
         }
      }
   )
);

passport.use(
   new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
         session: true,
      },
      async (email, password, done) => {
         try {
            const user = await verifyUserService({ password, email });
            done(null, user);
         } catch (err: any) {
            return done(err, false, { message: err.message });
         }
      }
   )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
