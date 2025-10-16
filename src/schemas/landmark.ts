import { z } from 'zod';
import { VALIDATION_MESSAGES, RATING_CONFIG, FILE_UPLOAD_CONFIG } from '@/config/constants';

function isValidRating(value: number): boolean {
  return !Object.is(value, NaN) && value >= RATING_CONFIG.MIN && value <= RATING_CONFIG.MAX;
}

export const landmarkSchema = z.object({
  title: z.string().min(1, { message: VALIDATION_MESSAGES.TITLE_REQUIRED }),
  description: z.string().min(1, { message: VALIDATION_MESSAGES.DESCRIPTION_REQUIRED }),
  userRating: z.coerce
    .number({
      required_error: VALIDATION_MESSAGES.RATING_REQUIRED,
    })
    .refine(isValidRating, {
      message: VALIDATION_MESSAGES.RATING_RANGE,
    }),
  photos: z
    .array(z.instanceof(File))
    .max(FILE_UPLOAD_CONFIG.MAX_FILES, { message: VALIDATION_MESSAGES.PHOTOS_MAX })
    .refine(
      files =>
        files.every(file =>
          (FILE_UPLOAD_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type)
        ),
      { message: VALIDATION_MESSAGES.FILE_TYPE_INVALID }
    )
    .refine(files => files.every(file => file.size <= FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES), {
      message: VALIDATION_MESSAGES.FILE_TOO_LARGE,
    })
    .optional()
    .default([]),
});

export type LandmarkFormData = z.infer<typeof landmarkSchema>;
