import express from 'express';
import { getTestHandler } from '../../../controllers/v1/test-controller';

const router = express.Router();

router.get('/', getTestHandler);

export { router as testRouter };
