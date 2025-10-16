import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import type { Rating } from '@/config/constants';
import * as landmarkService from '@/services/landmark';

export const useLandmarkStore = defineStore('landmark', () => {
  const landmarks = ref<Landmark[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const landmarkByIdMap = computed<Map<string, Landmark>>(() => {
    return new Map(landmarks.value.map(landmark => [landmark.id, landmark]));
  });

  function getLandmarkById(id: string) {
    return landmarkByIdMap.value.get(id);
  }

  function checkUserIsOwner(landmarkId: string, userId: string) {
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
    try {
      isLoading.value = true;
      error.value = null;
      landmarks.value = await landmarkService.getLandmarks();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch landmarks';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserLandmarks(userId: string) {
    try {
      isLoading.value = true;
      error.value = null;
      landmarks.value = await landmarkService.getUserLandmarks(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user landmarks';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createLandmark(landmark: NewLandmarkInput, files: File[]) {
    try {
      isLoading.value = true;
      error.value = null;
      const createdLandmark = await landmarkService.addLandmark(landmark, files);
      addLandmarkToStore(createdLandmark);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create landmark';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateLandmark(
    landmarkId: string,
    landmark: NewLandmarkInput,
    files: File[],
    photoIdsToDelete: string[] = []
  ) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedLandmark = await landmarkService.updateLandmark(
        landmarkId,
        landmark,
        files,
        photoIdsToDelete
      );
      landmarks.value = landmarks.value.map(l => (l.id === landmarkId ? updatedLandmark : l));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update landmark';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function rateLandmark(landmarkId: string, userId: string, rating: Rating) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedLandmark = await landmarkService.rateLandmark(landmarkId, userId, rating);
      landmarks.value = landmarks.value.map(l => (l.id === landmarkId ? updatedLandmark : l));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to rate landmark';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteLandmark(landmarkId: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await landmarkService.deleteLandmark(landmarkId);
      landmarks.value = landmarks.value.filter(l => l.id !== landmarkId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete landmark';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    landmarks,
    isLoading,
    error,
    getLandmarkById,
    checkUserIsOwner,
    getUserRating,
    fetchLandmarks,
    fetchUserLandmarks,
    createLandmark,
    updateLandmark,
    rateLandmark,
    deleteLandmark,
  };
});
