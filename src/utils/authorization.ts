import { Role } from '@prisma/client';
import { ROLE_MANAGE } from '@/constants/role';

// return boolean whether a role can edit other roles
export const checkManageUserAuthorization = (
  userRole: Role,
  targetUserRole: Role
) => {
  return ROLE_MANAGE[userRole].includes(targetUserRole);
};
