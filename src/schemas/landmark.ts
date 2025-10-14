import { z } from 'zod';
import { VALIDATION_MESSAGES, RATING_CONFIG, FILE_UPLOAD_CONFIG } from '@/config/constants';

export const landmarkSchema = z.object({
  title: z.string().min(1, { message: VALIDATION_MESSAGES.TITLE_REQUIRED }),
  description: z.string().min(1, { message: VALIDATION_MESSAGES.DESCRIPTION_REQUIRED }),
  userRating: z.coerce
    .number()
    .min(RATING_CONFIG.MIN, { message: VALIDATION_MESSAGES.RATING_REQUIRED })
    .max(RATING_CONFIG.MAX, { message: VALIDATION_MESSAGES.RATING_RANGE }),
  photos: z
    .array(z.instanceof(File))
    .max(FILE_UPLOAD_CONFIG.MAX_FILES, { message: VALIDATION_MESSAGES.PHOTOS_MAX })
    .optional()
    .default([]),
});
