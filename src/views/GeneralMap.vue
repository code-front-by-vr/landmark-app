<script setup lang="ts">
import { onMounted } from 'vue';
import leaflet from 'leaflet';
import { Dialog, DialogContent, DialogTrigger } from '@ui/dialog';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@ui/card';
import LandmarkModal from '@/components/landmark/LandmarkModal.vue';
import { Plus, MapPinned, Star } from 'lucide-vue-next';

let map;
onMounted(() => {
  map = leaflet.map('map').setView([53.9006, 27.559], 12);

  leaflet
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    })
    .addTo(map);
});
</script>

<template>
  <div class="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
    <div class="relative w-full lg:w-2/3 h-1/2 lg:h-full">
      <div id="map" class="w-full h-full relative z-0"></div>

      <div class="absolute top-4 right-4 z-10">
        <Dialog>
          <DialogTrigger as-child>
            <Button size="lg" class="shadow-lg">
              <Plus class="w-5 h-5 mr-2" />
              Add Landmark
            </Button>
          </DialogTrigger>
          <DialogContent class="z-[100] w-full max-w-2xl overflow-y-auto">
            <LandmarkModal />
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
        <Card class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg line-clamp-1">Independence Square</CardTitle>
            <CardDescription class="line-clamp-2">
              The main square of Minsk, heart of the city and site of major events
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span class="text-sm text-muted-foreground ml-1">5.0</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Star class="w-4 h-4" />
              <span>1523 ratings</span>
            </div>
          </CardContent>
        </Card>

        <!-- Landmark Card Example 2 -->
        <Card class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg line-clamp-1">National Library of Belarus</CardTitle>
            <CardDescription class="line-clamp-2">
              Iconic rhombicuboctahedron-shaped building, symbol of modern Minsk
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 text-gray-300" />
              <span class="text-sm text-muted-foreground ml-1">4.8</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Star class="w-4 h-4" />
              <span>1342 ratings</span>
            </div>
          </CardContent>
        </Card>

        <!-- Landmark Card Example 3 -->
        <Card class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg line-clamp-1">Trinity Suburb</CardTitle>
            <CardDescription class="line-clamp-2">
              Historic district with colorful buildings, museums and authentic atmosphere
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 text-gray-300" />
              <span class="text-sm text-muted-foreground ml-1">4.7</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Star class="w-4 h-4" />
              <span>987 ratings</span>
            </div>
          </CardContent>
        </Card>

        <!-- Landmark Card Example 4 -->
        <Card class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg line-clamp-1">Minsk Arena</CardTitle>
            <CardDescription class="line-clamp-2">
              Modern sports and entertainment complex, home to major events
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 text-gray-300" />
              <span class="text-sm text-muted-foreground ml-1">4.6</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Star class="w-4 h-4" />
              <span>756 ratings</span>
            </div>
          </CardContent>
        </Card>

        <!-- Landmark Card Example 5 -->
        <Card class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg line-clamp-1">Gorky Park</CardTitle>
            <CardDescription class="line-clamp-2">
              Central park with attractions, recreation zones and beautiful landscapes
            </CardDescription>
          </CardHeader>
          <CardContent class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star class="w-4 h-4 text-gray-300" />
              <span class="text-sm text-muted-foreground ml-1">4.5</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Star class="w-4 h-4" />
              <span>654 ratings</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
