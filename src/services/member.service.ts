import { ErrorCodeEnum } from '../enums/error-code.enum';
import MemberModel from '../models/member.model';
import { RoleDocument } from '../models/role-permission.model';
import WorkspaceModel from '../models/workspace.model';
import { NotFoundException, UnauthorizedException } from '../utils/app-error';

export const getMemberRoleInWorkspaceService = async (
   userId: string,
   workspaceId: string
) => {
   const workspace = await WorkspaceModel.findById(workspaceId);
   if (!workspace) {
      throw new NotFoundException('Workspace not found');
   }
   const member = await MemberModel.findOne({ userId, workspaceId }).populate<{
      role: RoleDocument;
   }>('role');

   if (!member) {
      throw new UnauthorizedException(
         'You are not a member of this workspace',
         ErrorCodeEnum.ACCESS_UNAUTHORIZED
      );
   }

   return { role: member.role.name };
};
