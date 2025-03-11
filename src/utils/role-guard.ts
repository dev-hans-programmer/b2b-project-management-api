import { PermissionEnumType, RoleEnumType } from '../enums/role.enum';
import { UnauthorizedException } from './app-error';
import { RolePermission } from './role-permission';

export const roleGuard = (
   role: RoleEnumType,
   providedPermissions: PermissionEnumType[]
) => {
   const permissions = RolePermission[role];

   const hasPermissions = providedPermissions.every((permission) =>
      permissions.includes(permission)
   );

   if (!hasPermissions)
      throw new UnauthorizedException(
         'You do not have the necessary permissions to perform this action'
      );
};
