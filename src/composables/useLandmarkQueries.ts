import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import * as landmarkService from '@/services/landmark';
import type { DocumentData, QueryDocumentSnapshot } from '@/api/firebase';
import { LANDMARK_CONFIG, type Rating } from '@/config/constants';
import type { NewLandmarkInput, UpdateLandmarkInput } from '@/types/landmark';

export function useLandmarksQueries() {
  return useInfiniteQuery({
    queryKey: ['landmarks'],
    queryFn: ({ pageParam }: { pageParam: QueryDocumentSnapshot<DocumentData> | null }) =>
      landmarkService.getPaginatedLandmarks({ lastDoc: pageParam }),
    getNextPageParam: lastPage => lastPage.lastDoc ?? null,
    initialPageParam: null,
  });
}
export function useUserLandmarksQueries(userId: string) {
  return useInfiniteQuery({
    queryKey: ['landmarks', 'user', userId],
    queryFn: ({ pageParam }: { pageParam: QueryDocumentSnapshot<DocumentData> | null }) =>
      landmarkService.getPaginatedLandmarks({
        lastDoc: pageParam,
        limit: LANDMARK_CONFIG.DEFAULT_LIMIT,
        onlyMy: true,
        userId,
      }),
    getNextPageParam: lastPage => lastPage.lastDoc ?? null,
    initialPageParam: null,
    enabled: !!userId,
  });
}

export function useLandmarkMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ landmark, files }: { landmark: NewLandmarkInput; files: File[] }) =>
      landmarkService.addLandmark(landmark, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ landmarkId, landmark, files, photoIdsToDelete }: UpdateLandmarkInput) =>
      landmarkService.updateLandmark({ landmarkId, landmark, files, photoIdsToDelete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (landmarkId: string) => landmarkService.deleteLandmark(landmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] });
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({
      landmarkId,
      userId,
      rating,
    }: {
      landmarkId: string;
      userId: string;
      rating: Rating;
    }) => landmarkService.rateLandmark(landmarkId, userId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    rateMutation,
  };
}
