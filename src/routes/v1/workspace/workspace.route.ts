import express from 'express';
import validateInput from '../../../utils/validate-input';

import {
   createWorkspaceSchema,
   updateWorkspaceSchema,
} from '../../../validation/workspace.validation';
import {
   createWorkspaceController,
   getAllWorkspacesOfUserController,
   getWorkspaceAnalyticsController,
   getWorkspaceByIdController,
   getWorkspaceMembersController,
   updateWorkspaceByIdController,
} from '../../../controllers/v1/workspace/workspace.controller';
import { isAuthenticated } from '../../../middlewares/auth.middleware';

const router = express.Router();

router.use(isAuthenticated);

router
   .route('/')
   .post(validateInput(createWorkspaceSchema), createWorkspaceController);
// Get all workspaces of the current user
router.get('/user/current', getAllWorkspacesOfUserController);

router
   .route('/:id')
   .get(getWorkspaceByIdController)
   .put(validateInput(updateWorkspaceSchema), updateWorkspaceByIdController);
router.route('/:id/members').get(getWorkspaceMembersController);
router.get('/:id/analytics', getWorkspaceAnalyticsController);

export { router as workspaceRouter };
