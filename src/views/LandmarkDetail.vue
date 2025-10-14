<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLandmarkStore } from '@/stores/landmark';
import { useAuthStore } from '@/stores/auth';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { MapPinned, Star, Eye, ArrowLeft, Edit, Trash2 } from 'lucide-vue-next';
import { Dialog, DialogTrigger } from '@ui/dialog';
import DialogScrollContent from '@ui/dialog/DialogScrollContent.vue';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';

const route = useRoute();
const router = useRouter();
const landmarkStore = useLandmarkStore();
const authStore = useAuthStore();

const isEditDialogOpen = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);

const landmarkId = computed(() => route.params.id as string);

const landmark = computed(() => landmarkStore.getLandmarkById(landmarkId.value));

const isOwner = computed(() =>
  authStore.user ? landmarkStore.isOwner(landmarkId.value, authStore.user.uid) : false
);

const userRating = computed(() =>
  authStore.user ? landmarkStore.getUserRating(landmarkId.value, authStore.user.uid) : null
);
const overallRating = computed(() => landmarkStore.getOverallRating(landmarkId.value));

const ratingsCount = computed(() => Object.keys(landmark.value?.userRatings || {}).length);

const { map, isReady, createMarker, setView, initializeMap } = useLeafletMap({
  containerId: 'detail-map',
  autoInit: false,
});

const handleEdit = () => {
  isEditDialogOpen.value = true;
};

const handleBack = () => router.push('/map');

const handleDelete = async () => {
  if (!landmark.value) return;

  // TODO: Replace with confirmation component from SHADCN
  if (confirm('Are you sure you want to delete this landmark?')) {
    try {
      await landmarkStore.deleteLandmark(landmark.value.id!);
      router.push('/map');
    } catch (error) {
      console.error('Failed to delete landmark:', error);
    }
  }
};

async function initializeMapWithLandmark() {
  if (!landmark.value) return;

  await nextTick();

  const success = await initializeMap();

  if (success && map.value) {
    const { lat, lng } = landmark.value.location;
    setView([lat, lng]);
    createMarker([lat, lng]);
  }
}

async function updateMapWithLandmark() {
  if (!landmark.value || !map.value) return;

  const { lat, lng } = landmark.value.location;
  setView([lat, lng]);
  createMarker([lat, lng]);
}

onMounted(async () => {
  try {
    if (landmarkStore.landmarks.length === 0) {
      await landmarkStore.fetchLandmarks();
    }
    if (!landmark.value) {
      error.value = 'Landmark not found';
      return;
    }
  } catch (err) {
    console.error('Error loading landmark:', err);
  } finally {
    isLoading.value = false;
  }

  if (landmark.value) {
    await initializeMapWithLandmark();
  }
});

watch(
  () => landmark.value?.location,
  () => {
    if (isReady.value && landmark.value) {
      updateMapWithLandmark();
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="bg-background">
    <div class="container mx-auto px-4 py-6 max-w-5xl">
      <Button variant="ghost" @click="handleBack" class="mb-4">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Map
      </Button>

      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="text-muted-foreground mt-4">Loading landmark...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-destructive mb-4">{{ error }}</p>
        <Button @click="handleBack">Back to Map</Button>
      </div>

      <div v-else-if="landmark" class="space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-3xl font-bold mb-2">{{ landmark.title }}</h2>
            <p class="text-muted-foreground">{{ landmark.description }}</p>
          </div>

          <div v-if="isOwner" class="flex gap-2">
            <Dialog v-model:open="isEditDialogOpen">
              <DialogTrigger as-child>
                <Button variant="outline" @click="handleEdit">
                  <Edit class="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogScrollContent class="z-[100] w-full max-w-2xl">
                <LandmarkModal
                  :landmark="landmark"
                  :is-edit="true"
                  @close="isEditDialogOpen = false"
                />
              </DialogScrollContent>
            </Dialog>

            <Button variant="destructive" @click="handleDelete">
              <Trash2 class="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <MapPinned class="w-5 h-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div id="detail-map" class="w-full h-96 rounded-md z-0"></div>
          </CardContent>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Star class="w-5 h-5 text-yellow-500" />
                Overall Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold">{{ overallRating.toFixed(1) }}</div>
              <p class="text-sm text-muted-foreground">Based on {{ ratingsCount }} ratings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Eye class="w-5 h-5 text-blue-500" />
                Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold">{{ landmark.visits }}</div>
              <p class="text-sm text-muted-foreground">Total visits</p>
            </CardContent>
          </Card>

          <Card v-if="userRating !== null">
            <CardHeader>
              <CardTitle class="text-lg">Your Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-2">
                <Star class="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span class="text-2xl font-bold">{{ userRating }}</span>
                <span class="text-muted-foreground">/ 5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card v-if="landmark.photos && landmark.photos.length > 0">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(photo, index) in landmark.photos"
                :key="index"
                class="aspect-square rounded-lg overflow-hidden"
              >
                <img
                  :src="photo"
                  :alt="`${landmark.title} - Photo ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">Landmark not found</p>
        <Button @click="handleBack" class="mt-4">Back to Map</Button>
      </div>
    </div>
  </div>
</template>
