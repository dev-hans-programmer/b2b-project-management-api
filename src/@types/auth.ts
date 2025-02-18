import { ProviderEnumType } from '../enums/account-provider.enum';

export interface LoginOrCreateAccount {
   name: string;
   email?: string;
   provider: string;
   providerId: string;
   profilePicture?: string;
}

export interface LoginPayload {
   email: string;
   password: string;
   provider?: ProviderEnumType;
}
