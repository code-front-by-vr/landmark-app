import { defineStore } from 'pinia';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import {
  getLandmarks,
  addLandmark,
  rateLandmark,
  deleteLandmark,
  updateLandmark,
} from '@/services/landmark';
import { calculateRating } from '@/lib/utils';

export const useLandmarkStore = defineStore('landmark', {
  state: () => ({
    landmarks: [] as Landmark[],
  }),
  getters: {
    getLandmarkById: state => (id: string) => {
      return state.landmarks.find(l => l.id === id);
    },
    isOwner() {
      return (landmarkId: string, userId: string) => {
        const landmark = this.getLandmarkById(landmarkId);

        return landmark?.createdBy === userId;
      };
    },
    getUserRating() {
      return (landmarkId: string, userId: string) => {
        const landmark = this.getLandmarkById(landmarkId);
        if (!landmark || !landmark.userRatings) return null;

        return landmark.userRatings[userId] || null;
      };
    },
    getOverallRating() {
      return (landmarkId: string) => {
        const landmark = this.getLandmarkById(landmarkId);
        if (!landmark) return 0;

        const { rating } = calculateRating(landmark.userRatings || {});

        return rating;
      };
    },
  },
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
    async updateLandmark(landmarkId: string, landmark: NewLandmarkInput, files: File[]) {
      const updatedLandmark = await updateLandmark(landmarkId, landmark, files);
      this.landmarks = this.landmarks.map(l => (l.id === landmarkId ? updatedLandmark : l));
    },
    async rateLandmark(landmarkId: string, userId: string, rating: number) {
      const updatedLandmark = await rateLandmark(landmarkId, userId, rating);
      this.landmarks = this.landmarks.map(l => (l.id === landmarkId ? updatedLandmark : l));
    },
    async deleteLandmark(landmarkId: string) {
      await deleteLandmark(landmarkId);
      this.landmarks = this.landmarks.filter(l => l.id !== landmarkId);
    },
  },
});
