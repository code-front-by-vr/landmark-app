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

export interface NewLandmarkInput {
  title: string;
  description: string;
  location: { lat: number; lng: number };
  rating: number;
  createdBy: string;
}

export interface LandmarkCardProps {
  title: string;
  description: string;
  rating: number;
  visits: number;
}
