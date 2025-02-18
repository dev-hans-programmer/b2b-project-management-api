import UserModel from '../models/user.model';
import { NotFoundException } from '../utils/app-error';

export const fetchCurrentUser = async (userId: string) => {
   const user = await UserModel.findById(userId)
      .populate('currentWorkspace')
      .select('-password');

   if (!user) throw new NotFoundException('user does not exist');

   return {
      user,
   };
};
