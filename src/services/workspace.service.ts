import mongoose from 'mongoose';
import MemberModel from '../models/member.model';
import RoleModel from '../models/role-permission.model';
import UserModel from '../models/user.model';
import WorkspaceModel from '../models/workspace.model';

import { RoleEnum } from '../enums/role.enum';
import { NotFoundException } from '../utils/app-error';
import { WorkspaceCreationPayload } from '../validation/workspace.validation';

export const createWorkspaceService = async (
   userId: string,
   payload: WorkspaceCreationPayload
) => {
   const session = await mongoose.startSession();

   try {
      session.startTransaction();

      const { name, description } = payload;

      const user = await UserModel.findById(userId).session(session);

      if (!user) throw new NotFoundException('User does not exist');

      const ownerRole = await RoleModel.findOne({
         name: RoleEnum.OWNER,
      }).session(session);

      if (!ownerRole) throw new NotFoundException('Owner role does not exist');

      const workspace = new WorkspaceModel({
         name,
         description,
         owner: userId,
      });

      await workspace.save({ session });

      const member = new MemberModel({
         userId,
         role: ownerRole._id,
         workspaceId: workspace._id,
      });

      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

      await user.save({ session });

      session.commitTransaction();

      return {
         workspace,
      };
   } catch (err) {
      session.abortTransaction();
      throw err;
   } finally {
      session.endSession();
   }
};

export const fetchWorkspacesOfUserService = async (userId: string) => {
   const members = await MemberModel.find({ userId }).populate('workspaceId');
   const workspaces = members.map((member) => member.workspaceId);

   return {
      workspaces,
   };
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
   const workspace = await WorkspaceModel.findById(workspaceId);

   if (!workspace) {
      throw new NotFoundException('Workspace not found');
   }
   const members = await MemberModel.find({ workspaceId }).populate('role');

   const workspaceWithMembers = {
      ...workspace.toObject(),
      members,
   };

   return { workspace: workspaceWithMembers };
};
