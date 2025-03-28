import { v4 as uuidv4 } from 'uuid';

export const generateInviteCode = () => uuidv4().replace(/-/g, '');
export const generateTaskCode = () =>
   `task-${uuidv4().replace(/-/g, '').slice(0, 3)}`;
