import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import type { Landmark, NewLandmarkInput, MapBounds, UpdateLandmarkInput } from '@/types/landmark';
import type { Rating } from '@/config/constants';
import {
  useLandmarksQueries,
  useLandmarkMutation,
  useUserLandmarksQueries,
} from '@/composables/useLandmarkQueries';
import {
  useMapLandmarksQuery,
  useUserMapLandmarksQuery,
} from '@/composables/useMapLandmarksQueries';
import { useAuthStore } from './auth';

export const useLandmarkStore = defineStore('landmark', () => {
  const selectedLandmarkId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const showOnlyMyLandmarks = ref(false);
  const mapBounds = ref<MapBounds | null>(null);

  const authStore = useAuthStore();

  const landmarksQueries = useLandmarksQueries();
  const userLandmarksQueries = useUserLandmarksQueries(authStore.user?.uid ?? '');
  const landmarksMutations = useLandmarkMutation();
  const mapLandmarksQuery = useMapLandmarksQuery(mapBounds);
  const userMapLandmarksQuery = useUserMapLandmarksQuery(mapBounds, authStore.user?.uid ?? '');

  const activeQuery = computed(() => {
    return showOnlyMyLandmarks.value ? userLandmarksQueries : landmarksQueries;
  });
  const activeMapQuery = computed(() => {
    return showOnlyMyLandmarks.value ? userMapLandmarksQuery : mapLandmarksQuery;
  });
  const allLandmarks = computed<Landmark[]>(() => {
    return landmarksQueries.data?.value?.pages.flatMap(page => page.landmarks) ?? [];
  });
  const userLandmarks = computed<Landmark[]>(() => {
    return userLandmarksQueries.data?.value?.pages.flatMap(page => page.landmarks) ?? [];
  });

  const landmarks = computed(() => {
    return showOnlyMyLandmarks.value ? userLandmarks.value : allLandmarks.value;
  });
  const mapLandmarks = computed(() => {
    return activeMapQuery.value.data?.value ?? [];
  });

  const landmarkByIdMap = computed<Map<string, Landmark>>(() => {
    return new Map(landmarks.value.map(landmark => [landmark.id, landmark]));
  });

  function getLandmarkById(id: string) {
    return landmarkByIdMap.value.get(id);
  }

  function checkUserIsOwner(landmarkId: string, userId: string) {
    return getLandmarkById(landmarkId)?.createdBy === userId;
  }

  function getUserRating(landmarkId: string, userId: string) {
    const landmark = getLandmarkById(landmarkId);
    if (!landmark || !landmark.userRatings) return null;

    return landmark.userRatings[userId] || null;
  }

  function setMapBounds(bounds: MapBounds) {
    mapBounds.value = bounds;
  }

  async function loadMoreLandmarks() {
    if (activeQuery.value.hasNextPage.value && !activeQuery.value.isFetchingNextPage.value) {
      await activeQuery.value.fetchNextPage();
    }
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
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user landmarks';
        error.value = errorMessage;
        toast.error('Error Loading Landmarks', {
          description: errorMessage,
        });
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to create landmark';
      error.value = errorMessage;
      toast.error('Error Creating Landmark', {
        description: errorMessage,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateLandmark({
    landmarkId,
    landmark,
    files,
    photoIdsToDelete,
  }: UpdateLandmarkInput) {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to update landmark';
      error.value = errorMessage;
      toast.error('Error Updating Landmark', {
        description: errorMessage,
      });
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to rate landmark';
      error.value = errorMessage;
      toast.error('Error Rating Landmark', {
        description: errorMessage,
      });
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete landmark';
      error.value = errorMessage;
      toast.error('Error Deleting Landmark', {
        description: errorMessage,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    selectedLandmarkId,
    showOnlyMyLandmarks,

    landmarks,

    mapLandmarks,
    setMapBounds,

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
