import { ErrorCodeEnum } from '../enums/error-code.enum';
import { RoleEnum } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import RoleModel, { RoleDocument } from '../models/role-permission.model';
import WorkspaceModel from '../models/workspace.model';
import {
   BadRequestException,
   NotFoundException,
   UnauthorizedException,
} from '../utils/app-error';

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

export const joinWorkspaceByInviteService = async (
   userId: string,
   inviteCode: string
) => {
   const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
   if (!workspace) {
      throw new NotFoundException('Invalid invite code or workspace not found');
   }

   // Check if user is already a member
   const existingMember = await MemberModel.findOne({
      userId,
      workspaceId: workspace._id,
   }).exec();

   if (existingMember) {
      throw new BadRequestException(
         'You are already a member of this workspace'
      );
   }

   const role = await RoleModel.findOne({ name: RoleEnum.MEMBER });

   if (!role) {
      throw new NotFoundException('Role not found');
   }

   // Add user to workspace as a member
   const newMember = new MemberModel({
      userId,
      workspaceId: workspace._id,
      role: role._id,
   });
   await newMember.save();

   return { workspaceId: workspace._id, role: role.name };
};
