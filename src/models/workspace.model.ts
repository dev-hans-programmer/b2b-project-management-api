import mongoose, { Document } from 'mongoose';
import { generateInviteCode } from '../utils/uuid';

export interface WorkspaceDocument extends Document {
   name: string;
   description: string;
   imageUrl?: string;
   inviteCode: string;
   owner: mongoose.Types.ObjectId;
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema<WorkspaceDocument>(
   {
      name: {
         type: String,
         required: [true, 'Name is required'],
         trim: true,
         unique: true,
      },
      description: {
         type: String,
      },
      imageUrl: {
         type: String,
         default: null,
      },
      inviteCode: {
         type: String,
         required: [true, 'Invite code is required'],
         unique: true,
         default: generateInviteCode(),
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Owner is required'],
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

workspaceSchema.methods.resetInviteCode = function () {
   this.inviteCode = generateInviteCode();
};

const WorkspaceModel = mongoose.model<WorkspaceDocument>(
   'Workspace',
   workspaceSchema
);
export default WorkspaceModel;
