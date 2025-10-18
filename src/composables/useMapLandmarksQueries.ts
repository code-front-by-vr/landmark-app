import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';
import * as landmarkService from '@/services/landmark';
import type { MapBounds } from '@/types/landmark';

export function useMapLandmarksQuery(bounds: Ref<MapBounds | null>) {
  return useQuery({
    queryKey: computed(() => ['landmarks', 'map', bounds.value]),
    queryFn: () => {
      if (!bounds.value) return [];

      return landmarkService.getLandmarksByBounds(bounds.value);
    },
    enabled: computed(() => !!bounds.value),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserMapLandmarksQuery(bounds: Ref<MapBounds | null>, userId: string) {
  return useQuery({
    queryKey: computed(() => ['landmarks', 'map', 'user', userId, bounds.value]),
    queryFn: () => {
      if (!bounds.value || !userId) return [];
      return landmarkService.getUserLandmarksByBounds(userId, bounds.value);
    },
    enabled: computed(() => !!bounds.value && !!userId),
    staleTime: 5 * 60 * 1000,
  });
}
