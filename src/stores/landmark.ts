import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import type { Rating } from '@/config/constants';
import {
  getLandmarksService,
  addLandmarkService,
  rateLandmarkService,
  deleteLandmarkService,
  updateLandmarkService,
  getUserLandmarksService,
} from '@/services/landmark';

export const useLandmarkStore = defineStore('landmark', () => {
  const landmarks = ref<Landmark[]>([]);

  function getLandmarkById(id: string) {
    return landmarks.value.find(l => l.id === id);
  }

  function isOwner(landmarkId: string, userId: string) {
    const landmark = getLandmarkById(landmarkId);
    return landmark?.createdBy === userId;
  }

  function getUserRating(landmarkId: string, userId: string) {
    const landmark = getLandmarkById(landmarkId);
    if (!landmark || !landmark.userRatings) return null;

    return landmark.userRatings[userId] || null;
  }

  function addLandmarkToStore(newLandmark: Landmark) {
    landmarks.value.push(newLandmark);
  }

  async function fetchLandmarks() {
    landmarks.value = await getLandmarksService();
  }

  async function fetchUserLandmarks(userId: string) {
    landmarks.value = await getUserLandmarksService(userId);
  }

  async function createLandmark(landmark: NewLandmarkInput, files: File[]) {
    const createdLandmark = await addLandmarkService(landmark, files);
    addLandmarkToStore(createdLandmark);
  }

  async function updateLandmark(
    landmarkId: string,
    landmark: NewLandmarkInput,
    files: File[],
    photosToDelete: string[] = []
  ) {
    const updatedLandmark = await updateLandmarkService(
      landmarkId,
      landmark,
      files,
      photosToDelete
    );
    landmarks.value = landmarks.value.map(l => (l.id === landmarkId ? updatedLandmark : l));
  }

  async function rateLandmark(landmarkId: string, userId: string, rating: Rating) {
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
    fetchLandmarks,
    fetchUserLandmarks,
    createLandmark,
    updateLandmark,
    rateLandmark,
    deleteLandmark,
  };
});
