import asyncHandler from '../../../middlewares/async-handler.middleware';
import { fetchCurrentUserService } from '../../../services/user.service';

export const getCurrentUserController = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   const { user } = await fetchCurrentUserService(userId);
   res.json({ message: 'User fetched successfully', user });
});
