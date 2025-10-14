<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import leaflet, { type Marker } from 'leaflet';
import { Button } from '@ui/button';
import { Dialog, DialogTrigger } from '@ui/dialog';
import DialogScrollContent from '@ui/dialog/DialogScrollContent.vue';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';
import { Plus, MapPinned } from 'lucide-vue-next';
import LandmarkCard from '@/components/landmark/LandmarkCard.vue';
import { useLandmarkStore } from '@/stores/landmark';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { MAP_CONFIG } from '@/config/constants';

const router = useRouter();
const isDialogOpen = ref(false);
const landmarkStore = useLandmarkStore();
const markers = ref<Marker[]>([]);

const { map } = useLeafletMap({
  containerId: 'map',
  center: [...MAP_CONFIG.DEFAULT_CENTER],
});

const updateMapMarkers = () => {
  if (!map.value) return;

  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  landmarkStore.landmarks.forEach(landmark => {
    const marker = leaflet
      .marker([landmark.location.lat, landmark.location.lng])
      .addTo(map.value!)
      .bindPopup(landmark.title);

    marker.on('click', () => {
      router.push(`/landmark/${landmark.id}`);
    });

    markers.value.push(marker);
  });
};

onMounted(async () => {
  await landmarkStore.fetchLandmarks();
  updateMapMarkers();
});

watch(() => landmarkStore.landmarks, updateMapMarkers, { deep: true });
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
            Top Landmarks
          </h2>
        </div>

        <Button variant="outline" size="sm" class="w-full"> Show Only My Landmarks </Button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <LandmarkCard
          v-for="landmark in landmarkStore.landmarks"
          :key="landmark.id"
          :id="landmark.id || ''"
          :title="landmark.title"
          :description="landmark.description"
          :rating="landmark.rating"
          :visits="landmark.visits"
        />
      </div>
    </div>
  </div>
</template>
