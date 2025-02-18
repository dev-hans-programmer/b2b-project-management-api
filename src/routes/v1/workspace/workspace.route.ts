import express from 'express';
import validateInput from '../../../utils/validate-input';

import { createWorkspaceSchema } from '../../../validation/workspace.validation';
import {
   createWorkspaceController,
   getAllWorkspacesOfUserController,
   getWorkspaceByIdController,
} from '../../../controllers/v1/workspace/workspace.controller';
import { isAuthenticated } from '../../../middlewares/auth.middleware';

const router = express.Router();

router.use(isAuthenticated);

router
   .route('/')
   .post(validateInput(createWorkspaceSchema), createWorkspaceController);

router.route('/:id').get(getWorkspaceByIdController);

// Get all workspaces of the current user
router.get('/user', getAllWorkspacesOfUserController);

export { router as workspaceRouter };
