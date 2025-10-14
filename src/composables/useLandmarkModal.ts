import { ref, computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { landmarkSchema } from '@/schemas/landmark';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { useFileUpload } from '@/composables/useFileUpload';
import { useAuthStore } from '@/stores/auth';
import { useLandmarkStore } from '@/stores/landmark';
import type { LatLngExpression } from 'leaflet';
import type { NewLandmarkInput, Landmark } from '@/types/landmark';
import type { Rating } from '@/config/constants';

interface UseLandmarkModalProps {
  isEdit?: boolean;
  landmark?: Landmark;
}

export function useLandmarkModal(props: UseLandmarkModalProps, emit: (event: 'close') => void) {
  const authStore = useAuthStore();
  const landmarkStore = useLandmarkStore();

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const photosToDelete = ref<string[]>([]);

  const isEditMode = computed(() => props.isEdit && props.landmark);

  const formSchema = toTypedSchema(landmarkSchema);

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      photos: [],
    },
  });

  const landmarkLocation = computed((): LatLngExpression | null => {
    if (props.landmark) {
      return [props.landmark.location.lat, props.landmark.location.lng];
    }
    return null;
  });

  const { marker } = useLeafletMap({
    containerId: 'landmark-map',
    center: landmarkLocation.value || undefined,
    enableClick: true,
    initialMarker: landmarkLocation.value || undefined,
  });

  const maxFiles = 5;

  const existingPhotos = computed(() => {
    if (!props.landmark?.photos) return [];
    return props.landmark.photos.filter(photo => !photosToDelete.value.includes(photo));
  });

  const existingPhotosCount = computed(() => existingPhotos.value.length);
  const maxNewFiles = computed(() => Math.max(0, maxFiles - existingPhotosCount.value));

  const {
    files: uploadedFiles,
    fileInputRef,
    handleFileSelect,
    handleFileDrop,
    clearFiles,
    removeFile: removeNewFile,
  } = useFileUpload({
    maxFiles: maxNewFiles.value,
  });

  const removePhoto = (item: string | number) => {
    if (typeof item === 'string') {
      if (!photosToDelete.value.includes(item)) {
        photosToDelete.value.push(item);
      }
    } else {
      removeNewFile(item);
    }
  };

  onMounted(() => {
    error.value = null;

    if (isEditMode.value && props.landmark) {
      form.setFieldValue('title', props.landmark.title);
      form.setFieldValue('description', props.landmark.description);

      if (authStore.user) {
        const userRating = landmarkStore.getUserRating(props.landmark.id, authStore.user.uid);
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

      if (isEditMode.value && props.landmark) {
        await landmarkStore.updateLandmark(
          props.landmark.id,
          landmarkData,
          uploadedFiles.value,
          photosToDelete.value
        );

        if (values.userRating) {
          await landmarkStore.rateLandmark(
            props.landmark.id,
            authStore.user.uid,
            values.userRating as Rating
          );
        }
      } else {
        await landmarkStore.createLandmark(landmarkData, uploadedFiles.value);
      }
      form.resetForm();
      clearFiles();

      emit('close');
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
  };
}
