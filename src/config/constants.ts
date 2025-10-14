export const MAP_CONFIG = {
  DEFAULT_CENTER: [53.9006, 27.559] as const,
  DEFAULT_ZOOM: 14,
  MAX_ZOOM: 19,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© OpenStreetMap',
} as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  STORAGE_PATH: 'landmarks',
} as const;

export const FILE_UPLOAD_ACCEPT = FILE_UPLOAD_CONFIG.ALLOWED_TYPES.join(',');

export const RATING_CONFIG = {
  MIN: 1,
  MAX: 5,
  DECAY_FACTOR: 0.1,
} as const;

export const LANDMARK_CONFIG = {
  DEFAULT_LIMIT: 10,
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
  RATING_REQUIRED: 'Rating is required',
  RATING_RANGE: `Rating must be between ${RATING_CONFIG.MIN} and ${RATING_CONFIG.MAX}`,
  PHOTOS_MIN: 'Please upload at least one photo',
  PHOTOS_MAX: `Maximum ${FILE_UPLOAD_CONFIG.MAX_FILES} photos allowed`,
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  FILE_TYPE_INVALID: 'Invalid file type. Only images are allowed',
} as const;
