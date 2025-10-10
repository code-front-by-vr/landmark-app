import { z } from 'zod';

export const landmarkSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  userRating: z
    .number()
    .min(1, { message: 'Rating is required' })
    .refine(val => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 5, {
      message: 'Rating must be between 1 and 5',
    }),
  photos: z.array(z.string()),
});
