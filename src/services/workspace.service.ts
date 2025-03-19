import mongoose from 'mongoose';
import MemberModel from '../models/member.model';
import RoleModel from '../models/role-permission.model';
import UserModel from '../models/user.model';
import WorkspaceModel from '../models/workspace.model';

import { RoleEnum } from '../enums/role.enum';
import { BadRequestException, NotFoundException } from '../utils/app-error';
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

      await session.commitTransaction();

      return {
         workspace,
      };
   } catch (err) {
      await session.abortTransaction();
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

export const updateWorkspaceByIdService = async (
   workspaceId: string,
   name?: string,
   description?: string
) => {
   const workspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      {
         $set: {
            ...(name && { name }),
            ...(description && { description }),
         },
      },
      { new: true }
   );

   if (!workspace) {
      throw new NotFoundException('Workspace not found');
   }

   return {
      workspace,
   };
};

export const deleteWorkspaceByIdService = async (
   workspaceId: string,
   userId: string
) => {
   const session = await mongoose.startSession();

   session.startTransaction();

   const workspace = await WorkspaceModel.findById(workspaceId).session(
      session
   );
   if (!workspace) {
      throw new NotFoundException('Workspace not found');
   }

   if (workspace.owner.toString() !== userId)
      throw new BadRequestException(
         'You are not allowed to delete this workspace'
      );

   const user = await UserModel.findById(userId).session(session);
   if (!user) {
      throw new NotFoundException('User not found');
   }

   // TODO: Delete projects, tasks, members, and workspace itself
   await MemberModel.deleteMany({ workspaceId }).session(session);

   // Update the user's currentWorkspace if it matches the deleted workspace
   await workspace.deleteOne({ session });
   if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(
         session
      );
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace
         ? memberWorkspace.workspaceId
         : null;

      await user.save({ session });
   }

   await session.commitTransaction();

   session.endSession();

   return {
      currentWorkspace: user.currentWorkspace,
   };
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
   // Fetch all members of the workspace

   const members = await MemberModel.find({
      workspaceId,
   })
      .populate('userId', 'name email profilePicture -password')
      .populate('role', 'name');

   const roles = await RoleModel.find({}, { name: 1, _id: 1 })
      .select('-permission')
      .lean();

   return { members, roles };
};

export const getWorkspaceAnalyticsService = async (workspaceId?: string) => {
   throw new NotFoundException('Not implemented');
};
