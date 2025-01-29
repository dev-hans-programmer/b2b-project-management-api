import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import AccountModel from '../models/account.model';
import WorkspaceModel from '../models/workspace.model';
import RoleModel from '../models/role-permission.model';
import { RoleEnum } from '../enums/role.enum';
import { NotFoundException } from '../utils/app-error';
import MemberModel from '../models/member.model';
import { LoginOrCreateAccount } from '../@types/auth';

export const loginOrCreateAccountService = async (
   payload: LoginOrCreateAccount
) => {
   const { name, profilePicture, provider, providerId, email } = payload;
   const session = await mongoose.startSession();
   session.startTransaction();
   console.log('Transaction started');

   try {
      let user = await UserModel.findOne({ email }).session(session);

      if (!user) {
         user = new UserModel({
            email,
            name,
            profilePicture,
         });

         await user.save({ session });

         const account = new AccountModel({
            userId: user._id,
            provider,
            providerId,
         });

         await account.save({ session });

         const workspace = new WorkspaceModel({
            name: 'My workspace',
            description: `Wokspace for ${user.name}`,
            owner: user._id,
         });

         await workspace.save({ session });

         const ownerRole = await RoleModel.findOne({
            name: RoleEnum.OWNER,
         }).session(session);

         if (!ownerRole) throw new NotFoundException('Owner role not found');

         const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
         });

         await member.save({ session });

         user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

         await user.save({ session });
      }

      await session.commitTransaction();
      return user;
   } catch (err) {
      await session.abortTransaction();
      throw err;
   } finally {
      session.endSession();
   }
};
