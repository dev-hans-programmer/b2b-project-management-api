import mongoose, { Document } from 'mongoose';
import {
   TaskPriorityEnum,
   TaskPriorityEnumType,
   TaskStatusEnum,
   TaskStatusEnumType,
} from '../enums/task.enum';
import { generateTaskCode } from '../utils/uuid';

export interface TaskDocument extends Document {
   taskCode: string;
   title: string;
   description: string | null;
   project: mongoose.Types.ObjectId;
   workspace: mongoose.Types.ObjectId;
   status: TaskStatusEnumType;
   priority: TaskPriorityEnumType;
   assignedTo: mongoose.Types.ObjectId | null;
   owner: mongoose.Types.ObjectId;
   dueDate: Date | null;
   createdAt: Date;
   updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
   {
      taskCode: {
         type: String,
         required: [true, 'Task code is required'],
         unique: true,
         default: generateTaskCode(),
      },
      title: {
         type: String,
         required: [true, 'Title is required'],
         trim: true,
      },
      description: {
         type: String,
         default: null,
      },
      project: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Project',
         required: [true, 'Project is required'],
      },
      workspace: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Workspace',
         required: [true, 'Workspace is required'],
      },
      status: {
         type: String,
         required: [true, 'Status is required'],
         enum: Object.values(TaskStatusEnum),
      },
      priority: {
         type: String,
         required: [true, 'Priority is required'],
         enum: Object.values(TaskPriorityEnum),
      },
      assignedTo: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: null,
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Owner is required'],
      },
      dueDate: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);
export default TaskModel;
