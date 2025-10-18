import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import type { Rating } from '@/config/constants';
import {
  useLandmarksQueries,
  useLandmarkMutation,
  useUserLandmarksQueries,
} from '@/composables/useLandmarkQueries';
import { useAuthStore } from './auth';

export const useLandmarkStore = defineStore('landmark', () => {
  const selectedLandmarkId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const showOnlyMyLandmarks = ref(false);

  const authStore = useAuthStore();

  const landmarksQueries = useLandmarksQueries();
  const userLandmarksQueries = useUserLandmarksQueries(authStore.user?.uid ?? '');
  const landmarksMutations = useLandmarkMutation();

  const allLandmarks = computed<Landmark[]>(() => {
    if (!landmarksQueries.data?.value?.pages.length) return [];

    return landmarksQueries.data.value.pages.flatMap(page => page.landmarks);
  });

  const userLandmarks = computed<Landmark[]>(() => {
    if (!userLandmarksQueries.data?.value?.pages.length) return [];

    return userLandmarksQueries.data.value.pages.flatMap(page => page.landmarks);
  });

  const landmarks = computed(() => {
    return showOnlyMyLandmarks.value ? userLandmarks.value : allLandmarks.value;
  });

  const activeQuery = computed(() => {
    return showOnlyMyLandmarks.value ? userLandmarksQueries : landmarksQueries;
  });

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

  async function toggleMyLandmarks() {
    if (!authStore.user?.uid) return;

    showOnlyMyLandmarks.value = !showOnlyMyLandmarks.value;

    if (showOnlyMyLandmarks.value && !userLandmarksQueries.data.value) {
      try {
        isLoading.value = true;
        error.value = null;
        await userLandmarksQueries.refetch();
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch user landmarks';
        //TODO: consider to replace with toast notification
        throw err;
      } finally {
        isLoading.value = false;
      }
    }
  }

  async function createLandmark(landmark: NewLandmarkInput, files: File[]) {
    try {
      isLoading.value = true;
      error.value = null;
      await landmarksMutations.createMutation.mutateAsync({ landmark, files });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create landmark';
      //TODO: consider to replace with toast notification
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

      await landmarksMutations.updateMutation.mutateAsync({
        landmarkId,
        landmark,
        files,
        photoIdsToDelete,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update landmark';
      // TODO: consider to replace with toast notification
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function rateLandmark(landmarkId: string, userId: string, rating: Rating) {
    try {
      isLoading.value = true;
      error.value = null;
      await landmarksMutations.rateMutation.mutateAsync({ landmarkId, userId, rating });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to rate landmark';
      //TODO: consider to replace with toast notification
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteLandmark(landmarkId: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await landmarksMutations.deleteMutation.mutateAsync(landmarkId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete landmark';
      //TODO: consider to replace with toast notification
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMoreLandmarks() {
    if (activeQuery.value.hasNextPage.value && !activeQuery.value.isFetchingNextPage.value) {
      await activeQuery.value.fetchNextPage();
    }
  }

  return {
    isLoading,
    error,
    selectedLandmarkId,
    showOnlyMyLandmarks,

    landmarks,

    getLandmarkById,
    checkUserIsOwner,
    getUserRating,

    createLandmark,
    updateLandmark,
    rateLandmark,
    deleteLandmark,
    toggleMyLandmarks,
    loadMoreLandmarks,
  };
});
