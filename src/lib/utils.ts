import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RATING_CONFIG } from '@/config/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateRating(userRatings: Record<string, number>) {
  const ratings = Object.values(userRatings || {});
  const V = ratings.length;

  if (V === 0) return { rating: 0, visits: 0 };

  const R = ratings.reduce((a, b) => a + b, 0) / V;

  const S = R * (1 - Math.exp(-RATING_CONFIG.DECAY_FACTOR * V));

  return {
    rating: Number(S.toFixed(2)),
    visits: V,
  };
}
