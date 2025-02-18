import { HTTPSTATUS } from '../../../config/http.config';
import asyncHandler from '../../../middlewares/async-handler.middleware';
import {
   createWorkspaceService,
   fetchWorkspacesOfUserService,
   getWorkspaceByIdService,
} from '../../../services/workspace.service';

export const createWorkspaceController = asyncHandler(async (req, res) => {
   const userId = req.user?._id;

   const { workspace } = await createWorkspaceService(userId, req.body);

   res.status(HTTPSTATUS.CREATED).json({
      message: 'Workspace successfully created',
      workspace,
   });
});

export const getAllWorkspacesOfUserController = asyncHandler(
   async (req, res) => {
      const { workspaces } = await fetchWorkspacesOfUserService(req.user?._id);

      res.json({ workspaces });
   }
);

export const getWorkspaceByIdController = asyncHandler(async (req, res) => {
   const { workspace } = await getWorkspaceByIdService(req.params.id);

   res.json({ workspace });
});
