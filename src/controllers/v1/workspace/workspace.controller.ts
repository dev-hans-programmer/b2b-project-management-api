import { HTTPSTATUS } from '../../../config/http.config';
import { PermissionEnum } from '../../../enums/role.enum';
import asyncHandler from '../../../middlewares/async-handler.middleware';
import { getMemberRoleInWorkspaceService } from '../../../services/member.service';
import {
   createWorkspaceService,
   fetchWorkspacesOfUserService,
   getWorkspaceByIdService,
   getWorkspaceMembersService,
} from '../../../services/workspace.service';
import { roleGuard } from '../../../utils/role-guard';

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
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   await getMemberRoleInWorkspaceService(userId, workspaceId);

   const { workspace } = await getWorkspaceByIdService(req.params.id);

   res.json({ workspace });
});

export const getWorkspaceMembersController = asyncHandler(async (req, res) => {
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

   roleGuard(role, [PermissionEnum.VIEW_ONLY]);

   const { members, roles } = await getWorkspaceMembersService(workspaceId);

   return res.json({
      message: 'Workspace members retrieved successfully',
      members,
      roles,
   });
});
