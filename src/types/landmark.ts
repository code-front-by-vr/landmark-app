export interface Landmark {
  id?: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  photos?: string[];
  rating: number;
  visits: number;
  createdBy: string;
  userRatings: Record<string, number>;
}

export type NewLandmarkInput = Pick<
  Landmark,
  'title' | 'description' | 'location' | 'rating' | 'createdBy'
>;
