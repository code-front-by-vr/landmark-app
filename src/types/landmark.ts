import { serverTimestamp } from '@/api/firebase';

export interface Landmark {
  id?: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  photos?: string[];
  rating: number;
  visits: number;
  createdBy: string;
  createdAt: ReturnType<typeof serverTimestamp>;
  userRatings: Record<string, number>;
}
export type NewLandmarkInput = Omit<
  Landmark,
  'id' | 'createdAt' | 'userRatings' | 'rating' | 'visits'
>;
