import bcrypt from 'bcrypt';

export const hasValue = async (value: any): Promise<string> => {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(value, salt);
};

export const compareValue = async (
   value: string,
   hash: string
): Promise<boolean> => {
   return bcrypt.compare(value, hash);
};
