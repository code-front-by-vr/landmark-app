import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const k = 0.1;

export function calculateRating(userRatings: Record<string, number>) {
  const ratings = Object.values(userRatings || {});
  const V = ratings.length;

  if (V === 0) return { rating: 0, visits: 0 };

  const R = ratings.reduce((a, b) => a + b, 0) / V;

  const S = R * (1 - Math.exp(-k * V));

  return {
    rating: Number(S.toFixed(2)),
    visits: V,
  };
}
