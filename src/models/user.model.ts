import mongoose, { Document } from 'mongoose';
import { compareValue, hasValue } from '../utils/bcrypt';

export interface UserDocument extends Document {
   name: string;
   email: string;
   password?: string;
   profilePicture: string | null;
   isActive: boolean;
   lastLogin: Date | null;
   createdAt: Date;
   updatedAt: Date;
   currentWorkspace: mongoose.Types.ObjectId | null;
   comparePassword(password: string): Promise<boolean>;
   omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new mongoose.Schema<UserDocument>(
   {
      name: {
         type: String,
         required: false,
         trim: true,
      },
      email: {
         type: String,
         required: [true, 'Email is required'],
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         select: true,
      },
      profilePicture: {
         type: String,
         default: null,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      lastLogin: {
         type: Date,
         default: null,
      },
      currentWorkspace: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Workspace',
      },
   },
   {
      timestamps: true,
   }
);

// hooks
userSchema.pre<UserDocument>('save', async function (next) {
   if (this.isModified('password')) {
      if (this.password) {
         this.password = await hasValue(this.password);
      }
   }
   next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
   const userObject = this.toObject() as UserDocument;
   delete userObject.password;
   return userObject;
};

userSchema.methods.comparePassword = function (
   typedPassword: string
): Promise<boolean> {
   return compareValue(typedPassword, this.password);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
