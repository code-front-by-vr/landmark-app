import { defineStore } from 'pinia';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import { getLandmarks, addLandmark, rateLandmark } from '@/services/landmark';

export const useLandmarkStore = defineStore('landmark', {
  state: () => ({
    landmarks: [] as Landmark[],
  }),
  actions: {
    addLandmarkToStore(newLandmark: Landmark) {
      this.landmarks = [...this.landmarks, newLandmark];
    },
    async fetchLandmarks() {
      this.landmarks = await getLandmarks();
    },
    async createLandmark(landmark: NewLandmarkInput, files: File[]) {
      const createdLandmark = await addLandmark(landmark, files);
      this.addLandmarkToStore(createdLandmark);
    },
    async rateLandmark(landmarkId: string, userId: string, rating: number) {
      const updatedLandmark = await rateLandmark(landmarkId, userId, rating);
      this.landmarks = this.landmarks.map(l => (l.id === landmarkId ? updatedLandmark : l));
    },
  },
});
