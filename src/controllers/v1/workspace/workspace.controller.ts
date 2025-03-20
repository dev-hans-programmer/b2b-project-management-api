import { HTTPSTATUS } from '../../../config/http.config';
import { PermissionEnum } from '../../../enums/role.enum';
import asyncHandler from '../../../middlewares/async-handler.middleware';
import { getMemberRoleInWorkspaceService } from '../../../services/member.service';
import {
   createWorkspaceService,
   deleteWorkspaceByIdService,
   fetchWorkspacesOfUserService,
   getWorkspaceAnalyticsService,
   getWorkspaceByIdService,
   getWorkspaceMembersService,
   updateWorkspaceByIdService,
} from '../../../services/workspace.service';
import { sendResponse } from '../../../utils/common';
import { roleGuard } from '../../../utils/role-guard';
import { WorkspaceUpdationPayload } from '../../../validation/workspace.validation';

export const createWorkspaceController = asyncHandler(async (req, res) => {
   const userId = req.user?._id;

   const { workspace } = await createWorkspaceService(userId, req.body);

   sendResponse(
      res,
      'success',
      { workspace },
      'Workspace successfully created',
      HTTPSTATUS.CREATED
   );
});

export const getAllWorkspacesOfUserController = asyncHandler(
   async (req, res) => {
      const { workspaces } = await fetchWorkspacesOfUserService(req.user?._id);

      sendResponse(res, 'success', { workspaces });
   }
);

export const getWorkspaceByIdController = asyncHandler(async (req, res) => {
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   await getMemberRoleInWorkspaceService(userId, workspaceId);

   const { workspace } = await getWorkspaceByIdService(req.params.id);

   sendResponse(res, 'success', { workspace });
});

export const updateWorkspaceByIdController = asyncHandler(async (req, res) => {
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   const { name, description } = req.body as WorkspaceUpdationPayload;

   const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

   roleGuard(role, [PermissionEnum.EDIT_WORKSPACE]);

   const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
   );

   sendResponse(res, 'success', { workspace });
});

export const deleteWorkspaceByIdController = asyncHandler(async (req, res) => {
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

   roleGuard(role, [PermissionEnum.DELETE_WORKSPACE]);

   const { currentWorkspace } = await deleteWorkspaceByIdService(
      workspaceId,
      userId
   );

   sendResponse(res, 'success', { currentWorkspace });
});

export const getWorkspaceMembersController = asyncHandler(async (req, res) => {
   const workspaceId = req.params.id;
   const userId = req.user?._id;

   const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

   roleGuard(role, [PermissionEnum.VIEW_ONLY]);

   const { members, roles } = await getWorkspaceMembersService(workspaceId);

   return sendResponse(
      res,
      'success',
      {
         members,
         roles,
      },
      'Workspace members retrieved successfully'
   );
});

export const getWorkspaceAnalyticsController = asyncHandler(
   async (req, res) => {
      const { analytics } = await getWorkspaceAnalyticsService(req.params.id);
      return sendResponse(
         res,
         'success',
         { analytics },
         'Workspace analytics retrieved'
      );
   }
);
