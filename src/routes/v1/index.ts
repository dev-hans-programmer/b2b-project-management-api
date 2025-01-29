import express, { Router } from 'express';
import { testRouter } from './test';
import { authRouter } from './auth/auth.route';

interface Route {
   path: string;
   router: Router;
}

const router = express.Router();
const routes: Route[] = [
   {
      path: '/test',
      router: testRouter,
   },
   {
      path: '/auth',
      router: authRouter,
   },
];

routes.forEach((route) => {
   router.use(route.path, route.router);
});
export { router as v1Router };
