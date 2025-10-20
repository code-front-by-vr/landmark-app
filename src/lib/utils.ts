import { RATING_CONFIG } from '@/config/constants';

export function calculateRatingStats(usersRatings: Record<string, number> = {}) {
  const ratings = Object.values(usersRatings);
  const visitsCount = ratings.length;

  if (visitsCount === 0) return { rating: 0, visits: 0 };

  const averageRating = ratings.reduce((a, b) => a + b, 0) / visitsCount;

  const finalScore = averageRating * (1 - Math.exp(-RATING_CONFIG.DECAY_FACTOR * visitsCount));

  return {
    rating: Number(finalScore.toFixed(2)),
    visits: visitsCount,
  };
}
