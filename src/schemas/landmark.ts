import { z } from 'zod';

export const landmarkSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  userRating: z.coerce
    .number()
    .min(1, { message: 'Rating is required' })
    .max(5, { message: 'Rating must be between 1 and 5' }),
  photos: z
    .array(z.instanceof(File))
    .min(1, { message: 'Please upload at least one photo' })
    .max(5, { message: 'Maximum 5 photos allowed' }),
});
