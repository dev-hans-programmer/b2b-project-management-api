import express from 'express';
import { testRouter } from './test';

const router = express.Router();
const routes = [
   {
      path: '/test',
      router: testRouter,
   },
];

routes.forEach((route) => {
   router.use(route.path, route.router);
});
export { router as v1Router };
