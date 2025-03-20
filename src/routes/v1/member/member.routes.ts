import express from 'express';

import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { joinWorkspaceController } from '../../../controllers/v1/member/member.controller';

const router = express.Router();

router.use(isAuthenticated);

router.post('/workspace/:inviteCode/join', joinWorkspaceController);

export { router as memberRouter };
