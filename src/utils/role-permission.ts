import {
   PermissionEnum,
   PermissionEnumType,
   RoleEnumType,
} from '../enums/role.enum';

export const RolePermission: Record<RoleEnumType, PermissionEnumType[]> = {
   OWNER: [
      PermissionEnum.CREATE_WORKSPACE,
      PermissionEnum.DELETE_WORKSPACE,
      PermissionEnum.EDIT_WORKSPACE,
      PermissionEnum.MANAGE_WORKSPACE_SETTINGS,

      PermissionEnum.ADD_MEMBER,
      PermissionEnum.CHANGE_MEMBER_ROLE,
      PermissionEnum.REMOVE_MEMBER,

      PermissionEnum.CREATE_PROJECT,
      PermissionEnum.EDIT_PROJECT,
      PermissionEnum.DELETE_PROJECT,

      PermissionEnum.CREATE_TASK,
      PermissionEnum.EDIT_TASK,
      PermissionEnum.DELETE_TASK,

      PermissionEnum.VIEW_ONLY,
   ],
   ADMIN: [
      PermissionEnum.ADD_MEMBER,
      PermissionEnum.CREATE_PROJECT,
      PermissionEnum.EDIT_PROJECT,
      PermissionEnum.DELETE_PROJECT,

      PermissionEnum.CREATE_TASK,
      PermissionEnum.EDIT_TASK,
      PermissionEnum.DELETE_TASK,
      PermissionEnum.MANAGE_WORKSPACE_SETTINGS,

      PermissionEnum.VIEW_ONLY,
   ],
   MEMBER: [
      PermissionEnum.CREATE_TASK,
      PermissionEnum.EDIT_TASK,
      PermissionEnum.DELETE_TASK,
      PermissionEnum.VIEW_ONLY,
   ],
};
