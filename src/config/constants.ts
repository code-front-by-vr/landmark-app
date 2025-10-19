export const MAP_CONFIG = {
  DEFAULT_CENTER: [53.9006, 27.559],
  DEFAULT_ZOOM: 14,
  MAX_ZOOM: 19,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© OpenStreetMap',
} as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_FILES: 5,
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  STORAGE_PATH: 'landmarks',
} as const;

export const FILE_UPLOAD_ACCEPT = FILE_UPLOAD_CONFIG.ALLOWED_TYPES.join(',');

export const RATING_CONFIG = {
  MIN: 1,
  MAX: 5,
  DECAY_FACTOR: 0.1,
} as const;

export type Rating = 1 | 2 | 3 | 4 | 5;

export type RatingSize = 'sm' | 'md' | 'lg';

export const RATING_SIZE_MAP: Record<RatingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const;

export const LANDMARK_CONFIG = {
  DEFAULT_LIMIT: 10,
} as const;

export const TOASTER_CONFIG = {
  DURATION: 4000,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Minimum 6 characters',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  TITLE_REQUIRED: 'Title is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  RATING_REQUIRED: 'Please select a rating from 1 to 5 stars',
  RATING_RANGE: `Rating must be between ${RATING_CONFIG.MIN} and ${RATING_CONFIG.MAX}`,
  PHOTOS_MIN: 'Please upload at least one photo',
  PHOTOS_MAX: `Maximum ${FILE_UPLOAD_CONFIG.MAX_FILES} photos allowed`,
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB`,
  FILE_TYPE_INVALID: 'Invalid file type. Only images are allowed',
} as const;
