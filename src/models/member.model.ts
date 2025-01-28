import mongoose, { Document } from 'mongoose';

export interface MemberDocument extends Document {
   userId: mongoose.Types.ObjectId;
   workspaceId: mongoose.Types.ObjectId;
   role: mongoose.Types.ObjectId;
   joinedAt: Date;
}

const memberSchema = new mongoose.Schema<MemberDocument>(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'User is required'],
      },
      workspaceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Workspace',
         required: [true, 'Workspace is required'],
      },
      role: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Role',
         required: [true, 'Role is required'],
      },
      joinedAt: {
         type: Date,
         default: Date.now,
      },
   },
   {
      timestamps: true,
   }
);

const MemberModel = mongoose.model<MemberDocument>('Member', memberSchema);
export default MemberModel;
