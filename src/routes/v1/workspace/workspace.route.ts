import express from 'express';
import validateInput from '../../../utils/validate-input';

import { createWorkspaceSchema } from '../../../validation/workspace.validation';
import {
   createWorkspaceController,
   getAllWorkspacesOfUserController,
   getWorkspaceByIdController,
   getWorkspaceMembersController,
} from '../../../controllers/v1/workspace/workspace.controller';
import { isAuthenticated } from '../../../middlewares/auth.middleware';

const router = express.Router();

router.use(isAuthenticated);

router
   .route('/')
   .post(validateInput(createWorkspaceSchema), createWorkspaceController);

router.route('/:id').get(getWorkspaceByIdController);
router.route('/:id/members').get(getWorkspaceMembersController);

// Get all workspaces of the current user
router.get('/user/current', getAllWorkspacesOfUserController);

export { router as workspaceRouter };
