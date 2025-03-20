import asyncHandler from '../../../middlewares/async-handler.middleware';
import { joinWorkspaceByInviteService } from '../../../services/member.service';
import { sendResponse } from '../../../utils/common';

export const joinWorkspaceController = asyncHandler(async (req, res) => {
   const inviteCode = req.params.inviteCode;
   const userId = req.user?._id;

   const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
   );

   return sendResponse(
      res,
      'success',
      { workspaceId, role },
      'Workspace analytics retrieved'
   );
});
