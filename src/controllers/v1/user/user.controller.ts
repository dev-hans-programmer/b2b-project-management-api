import asyncHandler from '../../../middlewares/async-handler.middleware';
import { fetchCurrentUserService } from '../../../services/user.service';
import { sendResponse } from '../../../utils/common';

export const getCurrentUserController = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   const { user } = await fetchCurrentUserService(userId);
   sendResponse(res, 'success', { user }, 'User fetched successfully');
});
