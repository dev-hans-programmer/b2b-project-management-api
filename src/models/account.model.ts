import mongoose, { Document } from 'mongoose';
import { ProviderEnum, ProviderEnumType } from '../enums/account-provider.enum';

export interface AccountDocument extends Document {
   provider: ProviderEnumType;
   providerId: string;
   userId: mongoose.Types.ObjectId;
   refreshToken: string | null;
   tokenExpiresIn: Date | null;
   createdAt: Date;
   updatedAt: Date;
}

const accountSchema = new mongoose.Schema<AccountDocument>(
   {
      provider: {
         type: String,
         required: [true, 'Provider is required'],
         enum: Object.values(ProviderEnum),
      },
      providerId: {
         type: String,
         required: [true, 'Provider ID is required'],
         unique: [true, 'Provider ID must be unique'],
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'User ID is required'],
      },
      refreshToken: {
         type: String,
         default: null,
      },
      tokenExpiresIn: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform(doc, ret) {
            delete ret.refreshToken;
         },
      },
   }
);

const AccountModel = mongoose.model<AccountDocument>('Account', accountSchema);
export default AccountModel;
