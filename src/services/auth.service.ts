import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import AccountModel from '../models/account.model';
import WorkspaceModel from '../models/workspace.model';
import RoleModel from '../models/role-permission.model';
import MemberModel from '../models/member.model';

import { RoleEnum } from '../enums/role.enum';
import {
   BadRequestException,
   NotFoundException,
   UnauthorizedException,
} from '../utils/app-error';
import { LoginOrCreateAccount, LoginPayload } from '../@types/auth';
import { RegisterPayload } from '../validation/auth.validation';
import { ProviderEnum } from '../enums/account-provider.enum';
import { logger } from '../config/logger.config';

export const loginOrCreateAccountService = async (
   payload: LoginOrCreateAccount
) => {
   const { name, profilePicture, provider, providerId, email } = payload;
   const session = await mongoose.startSession();
   session.startTransaction();
   logger.info('Transaction started');

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
      logger.info('Transaction completed');
      return user;
   } catch (err) {
      await session.abortTransaction();
      throw err;
   } finally {
      session.endSession();
   }
};

export const registerService = async (payload: RegisterPayload) => {
   const { name, email, password } = payload;

   const session = await mongoose.startSession();

   try {
      session.startTransaction();
      const isExist = await UserModel.findOne({ email }).session(session);

      if (isExist) throw new BadRequestException('User already exists');

      const user = new UserModel({
         name,
         email,
         password,
      });

      await user.save({ session });

      const account = new AccountModel({
         userId: user._id,
         provider: ProviderEnum.EMAIL,
         providerId: email,
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

      await session.commitTransaction();

      return { userId: user._id };
   } catch (err) {
      await session.abortTransaction();
      throw err;
   } finally {
      session.endSession();
   }
};

export const verifyUserService = async ({
   email,
   password,
   provider = ProviderEnum.EMAIL,
}: LoginPayload) => {
   const account = await AccountModel.findOne({
      provider,
      providerId: email,
   });
   if (!account) throw new NotFoundException('Account does not exist');

   const user = await UserModel.findOne({ email });

   if (!user) throw new NotFoundException('User does not exist');

   const isMatch = await user.comparePassword(password);

   if (!isMatch) throw new UnauthorizedException('Unauthorized');

   return user.omitPassword();
};
