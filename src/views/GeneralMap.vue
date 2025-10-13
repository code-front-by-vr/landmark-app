<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import leaflet from 'leaflet';
import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@ui/dialog';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';
import { Plus, MapPinned } from 'lucide-vue-next';
import type { Map, Marker } from 'leaflet';
import LandmarkCard from '@/components/landmark/LandmarkCard.vue';
import { useLandmarkStore } from '@/stores/landmark';

let map: Map | null = null;
const isDialogOpen = ref(false);
const landmarkStore = useLandmarkStore();
const markers = ref<Marker[]>([]);

const updateMapMarkers = () => {
  if (!map) return;

  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  landmarkStore.landmarks.forEach(landmark => {
    const marker = leaflet
      .marker([landmark.location.lat, landmark.location.lng])
      .addTo(map!)
      .bindPopup(landmark.title);
    markers.value.push(marker);
  });
};

onMounted(async () => {
  map = leaflet.map('map').setView([53.9006, 27.559], 12);

  leaflet
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    })
    .addTo(map);

  await landmarkStore.fetchLandmarks();
  updateMapMarkers();
});

watch(() => landmarkStore.landmarks, updateMapMarkers, { deep: true });
</script>

<template>
  <div class="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
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
          <DialogContent class="z-[100] w-full max-w-2xl overflow-y-auto">
            <LandmarkModal @close="isDialogOpen = false" />
          </DialogContent>
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
          :title="landmark.title"
          :description="landmark.description"
          :rating="landmark.rating"
          :visits="landmark.visits"
        />
      </div>
    </div>
  </div>
</template>
