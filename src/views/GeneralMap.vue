<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, MapPinned } from 'lucide-vue-next';
import leaflet, { type Marker } from 'leaflet';
import { Button } from '@ui/button';
import { Dialog, DialogTrigger } from '@ui/dialog';
import DialogScrollContent from '@ui/dialog/DialogScrollContent.vue';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';
import LandmarkList from '@/components/landmark/LandmarkList.vue';
import { useLandmarkStore } from '@/stores/landmark';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { MAP_CONFIG } from '@/config/constants';

const router = useRouter();
const isDialogOpen = ref(false);
const markers = ref<Marker[]>([]);

const landmarkStore = useLandmarkStore();

const { map, bounds, isInteracting } = useLeafletMap({
  containerId: 'map',
  center: [...MAP_CONFIG.DEFAULT_CENTER],
});

const normalizedBounds = computed(() => {
  if (!bounds.value) return null;

  return {
    north: bounds.value.getNorth(),
    south: bounds.value.getSouth(),
    east: bounds.value.getEast(),
    west: bounds.value.getWest(),
  };
});

const mapLandmarks = computed(() => landmarkStore.mapLandmarks);
const displayedLandmarks = computed(() => landmarkStore.landmarks);

const updateMapMarkers = () => {
  if (!map.value) return;

  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  mapLandmarks.value.forEach(landmark => {
    const marker = leaflet
      .marker([landmark.location.lat, landmark.location.lng])
      .addTo(map.value!)
      .bindTooltip(landmark.title, {
        direction: 'top',
        offset: [0, -10],
        opacity: 0.9,
        permanent: false,
        className: 'custom-tooltip',
      });

    marker.on('click', () => {
      router.push(`/landmark/${landmark.id}`);
    });

    markers.value.push(marker);
  });
};

async function toggleMyLandmarks() {
  await landmarkStore.toggleMyLandmarks();
}

watch(
  normalizedBounds,
  newBounds => {
    if (newBounds && !isInteracting.value) {
      landmarkStore.setMapBounds(newBounds);
    }
  },
  { immediate: true }
);

watch(isInteracting, interacting => {
  if (!interacting && normalizedBounds.value) {
    landmarkStore.setMapBounds(normalizedBounds.value);
  }
});

watch(map, newMap => {
  if (newMap && normalizedBounds.value) {
    landmarkStore.setMapBounds(normalizedBounds.value);
  }
});

watch([mapLandmarks, map], () => {
  updateMapMarkers();
});

onUnmounted(() => {
  markers.value.forEach(marker => marker.remove());
  markers.value = [];
});
</script>

<template>
  <div class="flex flex-col lg:flex-row h-[calc(100vh-3rem)]">
    <div class="relative w-full lg:w-2/3 h-1/2 lg:h-full">
      <div id="map" class="w-full h-full relative z-0"></div>

      <div class="absolute top-4 right-4 z-10">
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button size="lg" class="shadow-lg">
              <Plus class="w-5 h-5 mr-2" />
              Add Landmark
            </Button>
          </DialogTrigger>
          <DialogScrollContent class="z-[100] w-full max-w-2xl">
            <LandmarkModal @close="isDialogOpen = false" />
          </DialogScrollContent>
        </Dialog>
      </div>
    </div>

    <div class="w-full lg:w-1/3 h-1/2 lg:h-full bg-background flex flex-col">
      <div class="p-4 border-b border-border bg-card">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <MapPinned class="w-5 h-5 text-primary" />
            {{ landmarkStore.showOnlyMyLandmarks ? 'My Landmarks' : 'Top Landmarks' }}
          </h2>
        </div>

        <Button variant="outline" size="sm" class="w-full" @click="toggleMyLandmarks">
          {{ landmarkStore.showOnlyMyLandmarks ? 'Show All Landmarks' : 'Show Only My Landmarks' }}
        </Button>
      </div>

      <LandmarkList :landmarks="displayedLandmarks" />
    </div>
  </div>
</template>

<style scoped>
.custom-tooltip {
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
