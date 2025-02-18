import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from 'cookie-session';
import { config } from './config/app.config';
import { v1Router } from './routes/v1';
import { errorHandler } from './middlewares/error.middleware';

import './config/passport.config';
import passport from 'passport';
import { NotFoundException } from './utils/app-error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
   cors({
      origin: [config.FRONTEND_ORIGIN],
      credentials: true,
   })
);

app.use(
   session({
      name: 'session',
      keys: [config.SESSION_SECRET],
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
   })
);

app.use(passport.initialize());
app.use(passport.session());

// mount routes
app.use(`${config.BASE_PATH}/v1`, v1Router);

app.all('*', (req, _res, next) =>
   next(
      new NotFoundException(
         `Can't find route ${req.originalUrl} on the server global`
      )
   )
);

app.use(errorHandler);

export default app;
