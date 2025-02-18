import express from 'express';
import { getCurrentUserController } from '../../../controllers/v1/user/user.controller';
import { isAuthenticated } from '../../../middlewares/auth.middleware';

const router = express.Router();

router.use(isAuthenticated);

router.get('/current', getCurrentUserController);

export { router as userRouter };
