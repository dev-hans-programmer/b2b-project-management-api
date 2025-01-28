import mongoose, { Document } from 'mongoose';
import {
   PermissionEnum,
   PermissionEnumType,
   RoleEnum,
   RoleEnumType,
} from '../enums/role.enum';
import { RolePermission } from '../utils/role-permission';

export interface RoleDocument extends Document {
   name: RoleEnumType;
   permissions: PermissionEnumType[];
}

const roleSchema = new mongoose.Schema<RoleDocument>(
   {
      name: {
         type: String,
         required: [true, 'Role name is required'],
         enum: Object.values(RoleEnum),
      },
      permissions: {
         type: [String],
         required: [true, 'Permissions are required'],
         enum: Object.values(PermissionEnum),
         default: function (this: RoleDocument) {
            return RolePermission[this.name];
         },
      },
   },
   {
      timestamps: true,
   }
);

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema);
export default RoleModel;
