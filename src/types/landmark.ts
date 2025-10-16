import type { Rating } from '@/config/constants';

export interface Location {
  readonly lat: number;
  readonly lng: number;
}

export interface UserRatings {
  readonly [userId: string]: Rating;
}

export interface Photo {
  readonly id: string;
  readonly url: string;
  readonly uploadedAt: number;
  readonly fileName: string;
}

export interface BasicLandmark {
  title: string;
  description: string;
  location: Location;
  photos?: readonly Photo[];
  rating: number;
  visits: number;
  createdBy: string;
  userRatings: UserRatings;
}
export interface Landmark extends BasicLandmark {
  readonly id: string;
}

export type NewLandmarkInput = Pick<
  BasicLandmark,
  'title' | 'description' | 'location' | 'createdBy'
> & {
  rating?: Rating;
};
