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
import { toast } from 'vue-sonner';

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
    if (!landmarkId) return null;

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
      userRating: 0,
    },
  });

  const { marker } = useLeafletMap({
    containerId: mapContainerId,
    center: landmark.value?.location,
    enableClick: true,
    initialMarker: landmark.value?.location,
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

    if (!isEditMode.value || !landmark.value) return;

    form.setFieldValue('title', landmark.value.title);
    form.setFieldValue('description', landmark.value.description);

    if (!authStore.user) return;

    const userRating = landmarkStore.getUserRating(landmark.value.id, authStore.user.uid);
    if (!userRating) return;

    form.setFieldValue('userRating', userRating);
  });

  const onSubmit = form.handleSubmit(async values => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!marker.value) {
        toast.error('Error', {
          description: 'Please select a location on the map',
        });
        return;
      }

      if (!authStore.user) {
        toast.error('Authentication Error', { description: 'User not authenticated' });
        return;
      }

      if (!isEditMode.value && uploadedFiles.value.length === 0) {
        form.setFieldError('photos', 'Please upload at least one photo');
        toast.error('Error', {
          description: 'Please upload at least one photo',
        });
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
        await landmarkStore.updateLandmark({
          landmarkId: landmark.value.id,
          landmark: landmarkData,
          files: uploadedFiles.value,
          photoIdsToDelete: photoIdsToDelete.value,
        });

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
    } catch (error) {
      console.error(error);
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
