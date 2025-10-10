import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Minimum 6 characters' }),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Minimum 6 characters' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email' }),
});
