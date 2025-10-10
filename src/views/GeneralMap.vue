<script setup lang="ts">
import { onMounted } from 'vue';
import leaflet from 'leaflet';
import { Dialog, DialogContent, DialogTrigger } from '@ui/dialog';
import { Button } from '@ui/button';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';

let map;
onMounted(() => {
  map = leaflet.map('map').setView([51.505, -0.09], 13);

  leaflet
    .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(map);
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div id="map" class="h-1/2 z-1"></div>

    <div class="p-4 flex flex-col justify-between gap-4">
      <div class="flex justify-between">
        <h2 class="text-2xl font-bold">Most popular landmarks:</h2>
        <Dialog>
          <DialogTrigger as-child>
            <Button size="sm">Add landmark</Button>
          </DialogTrigger>
          <DialogContent class="w-full z-50">
            <LandmarkModal />
          </DialogContent>
        </Dialog>
      </div>

      <ul>
        <li>Landmark 1</li>
        <li>Landmark 2</li>
        <li>Landmark 3</li>
      </ul>
    </div>
  </div>
</template>
