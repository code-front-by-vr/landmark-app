import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/config/constants';

const emailSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID });

const passwordSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  .min(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH });

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
