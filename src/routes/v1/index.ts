import express, { Router } from 'express';
import { testRouter } from './test';
import { authRouter } from './auth/auth.route';
import { userRouter } from './user/user.route';
import { workspaceRouter } from './workspace/workspace.route';

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
   {
      path: '/user',
      router: userRouter,
   },
   {
      path: '/workspace',
      router: workspaceRouter,
   },
];

routes.forEach((route) => {
   router.use(route.path, route.router);
});
export { router as v1Router };
