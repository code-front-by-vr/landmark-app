import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import {
  getLandmarksService,
  addLandmarkService,
  rateLandmarkService,
  deleteLandmarkService,
  updateLandmarkService,
} from '@/services/landmark';
import { calculateRatingStats } from '@/lib/utils';

export const useLandmarkStore = defineStore('landmark', () => {
  const landmarks = ref<Landmark[]>([]);

  const getLandmarkById = computed(() => (id: string) => {
    return landmarks.value.find(l => l.id === id);
  });

  const isOwner = computed(() => (landmarkId: string, userId: string) => {
    const landmark = getLandmarkById.value(landmarkId);
    return landmark?.createdBy === userId;
  });

  const getUserRating = computed(() => (landmarkId: string, userId: string) => {
    const landmark = getLandmarkById.value(landmarkId);
    if (!landmark || !landmark.userRatings) return null;

    return landmark.userRatings[userId] || null;
  });

  const getOverallRating = computed(() => (landmarkId: string) => {
    const landmark = getLandmarkById.value(landmarkId);
    if (!landmark) return 0;

    const { rating } = calculateRatingStats(landmark.userRatings || {});
    return rating;
  });

  function addLandmarkToStore(newLandmark: Landmark) {
    landmarks.value = [...landmarks.value, newLandmark];
  }

  async function fetchLandmarks() {
    landmarks.value = await getLandmarksService();
  }

  async function createLandmark(landmark: NewLandmarkInput, files: File[]) {
    const createdLandmark = await addLandmarkService(landmark, files);
    addLandmarkToStore(createdLandmark);
  }

  async function updateLandmark(landmarkId: string, landmark: NewLandmarkInput, files: File[]) {
    const updatedLandmark = await updateLandmarkService(landmarkId, landmark, files);
    landmarks.value = landmarks.value.map(l => (l.id === landmarkId ? updatedLandmark : l));
  }

  async function rateLandmark(landmarkId: string, userId: string, rating: number) {
    const updatedLandmark = await rateLandmarkService(landmarkId, userId, rating);
    landmarks.value = landmarks.value.map(l => (l.id === landmarkId ? updatedLandmark : l));
  }

  async function deleteLandmark(landmarkId: string) {
    await deleteLandmarkService(landmarkId);
    landmarks.value = landmarks.value.filter(l => l.id !== landmarkId);
  }

  return {
    landmarks,
    getLandmarkById,
    isOwner,
    getUserRating,
    getOverallRating,
    addLandmarkToStore,
    fetchLandmarks,
    createLandmark,
    updateLandmark,
    rateLandmark,
    deleteLandmark,
  };
});
