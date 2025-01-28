import mongoose from 'mongoose';

export interface ProjectDocument extends Document {
   name: string;
   description: string | null;
   owner: mongoose.Types.ObjectId;
   emoji: string;
   workspace: mongoose.Types.ObjectId;
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const projectSchema = new mongoose.Schema<ProjectDocument>(
   {
      name: {
         type: String,
         required: [true, 'Name is required'],
         trim: true,
      },
      description: {
         type: String,
         default: null,
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Owner is required'],
      },
      emoji: {
         type: String,
         required: [true, 'Emoji is required'],
      },
      workspace: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Workspace',
         required: [true, 'Workspace is required'],
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

const ProjectModel = mongoose.model<ProjectDocument>('Project', projectSchema);
export default ProjectModel;
