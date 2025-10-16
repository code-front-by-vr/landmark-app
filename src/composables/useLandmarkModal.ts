import { ref, computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { landmarkSchema } from '@/schemas/landmark';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { useFileUpload } from '@/composables/useFileUpload';
import { useAuthStore } from '@/stores/auth';
import { useLandmarkStore } from '@/stores/landmark';
import type { NewLandmarkInput } from '@/types/landmark';
import type { Rating } from '@/config/constants';

interface UseLandmarkModalOptions {
  landmarkId?: string;
  onClose: () => void;
  maxFiles: number;
  mapContainerId?: string;
}

export function useLandmarkModal({
  landmarkId,
  onClose,
  maxFiles,
  mapContainerId = 'landmark-map',
}: UseLandmarkModalOptions) {
  const authStore = useAuthStore();
  const landmarkStore = useLandmarkStore();

  const landmark = computed(() => {
    if (!landmarkId) return;

    return landmarkStore.getLandmarkById(landmarkId);
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const photoIdsToDelete = ref<string[]>([]);

  const isEditMode = computed(() => !!landmark.value);

  const formSchema = toTypedSchema(landmarkSchema);

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      photos: [],
    },
  });

  const { marker } = useLeafletMap({
    containerId: mapContainerId,
    center: landmark.value?.location ?? null,
    enableClick: true,
    initialMarker: landmark.value?.location ?? null,
  });

  const existingPhotos = computed(
    () => landmark.value?.photos?.filter(photo => !photoIdsToDelete.value.includes(photo.id)) ?? []
  );

  const existingPhotosCount = computed(() => existingPhotos.value.length);
  const maxNewFiles = computed(() => Math.max(0, maxFiles - existingPhotosCount.value));

  const {
    files: uploadedFiles,
    fileInputRef,
    handleFileSelect,
    handleFileDrop,
    clearFiles,
    removeFile: removeNewFile,
    getFileId,
  } = useFileUpload({
    maxFiles: maxNewFiles.value,
  });

  const removePhoto = (photoId: string) => {
    const isExistingPhoto = existingPhotos.value.some(photo => photo.id === photoId);

    if (isExistingPhoto) {
      if (!photoIdsToDelete.value.includes(photoId)) {
        photoIdsToDelete.value.push(photoId);
      }
    } else {
      removeNewFile(photoId);
    }
  };

  onMounted(() => {
    error.value = null;

    if (isEditMode.value && landmark.value) {
      form.setFieldValue('title', landmark.value.title);
      form.setFieldValue('description', landmark.value.description);

      if (authStore.user) {
        const userRating = landmarkStore.getUserRating(landmark.value.id, authStore.user.uid);
        if (userRating) {
          form.setFieldValue('userRating', userRating);
        }
      }
    }
  });

  const onSubmit = form.handleSubmit(async values => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!marker.value) {
        throw new Error('Please select a location on the map');
      }

      if (!authStore.user) {
        throw new Error('User not authenticated');
      }

      if (!isEditMode.value && uploadedFiles.value.length === 0) {
        form.setFieldError('photos', 'Please upload at least one photo');
        return;
      }

      const landmarkData: NewLandmarkInput = {
        title: values.title,
        description: values.description,
        location: {
          lat: marker.value.getLatLng().lat,
          lng: marker.value.getLatLng().lng,
        },
        createdBy: authStore.user.uid,
        rating: values.userRating as Rating,
      };

      if (isEditMode.value && landmark.value) {
        await landmarkStore.updateLandmark(
          landmark.value.id,
          landmarkData,
          uploadedFiles.value,
          photoIdsToDelete.value
        );

        if (values.userRating) {
          await landmarkStore.rateLandmark(
            landmark.value.id,
            authStore.user.uid,
            values.userRating as Rating
          );
        }
      } else {
        await landmarkStore.createLandmark(landmarkData, uploadedFiles.value);
      }
      form.resetForm();
      clearFiles();

      onClose();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  });

  return {
    form,
    isLoading,
    error,
    marker,
    uploadedFiles,
    fileInputRef,
    removePhoto,
    existingPhotos,
    handleFileSelect,
    handleFileDrop,
    maxNewFiles,
    existingPhotosCount,
    isEditMode,
    onSubmit,
    getFileId,
  };
}
