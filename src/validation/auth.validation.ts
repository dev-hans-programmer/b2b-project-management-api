import { z } from 'zod';

const emailSchema = z
   .string()
   .trim()
   .email('Invalid email address')
   .min(1)
   .max(200);
const passwordSchema = z.string().trim().min(4).default('1234');

export const registerSchema = z.object({
   name: z
      .string({
         required_error: 'Name is required',
         invalid_type_error: 'Name must be a string',
      })
      .trim()
      .min(1)
      .max(255)
      .default('Hasan'),
   email: emailSchema,
   password: passwordSchema,
});

export const loginSchema = z.object({
   email: emailSchema,
   password: passwordSchema,
});

export type RegisterPayload = z.infer<typeof registerSchema>;
