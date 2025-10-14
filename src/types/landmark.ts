import type { Rating } from '@/config/constants';

export interface Location {
  readonly lat: number;
  readonly lng: number;
}

export interface UserRatings {
  readonly [userId: string]: Rating;
}

export interface LandmarkBase {
  title: string;
  description: string;
  location: Location;
  photos?: readonly string[];
  rating: number;
  visits: number;
  createdBy: string;
  userRatings: UserRatings;
}
export interface Landmark extends LandmarkBase {
  readonly id: string;
}

export type NewLandmarkInput = Pick<
  LandmarkBase,
  'title' | 'description' | 'location' | 'createdBy'
> & {
  rating?: Rating;
};
